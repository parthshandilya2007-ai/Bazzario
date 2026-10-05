import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { ApiResponse, Order, Address } from '@/types';
import { getStoreOrders, updateOrderStatusInStore } from '@/lib/mockStore';
import { toast } from '@/components/ui/toast';
import { emitGlobalSocketMutation } from '@/context/SocketContext';

export interface PlaceOrderPayload {
  shippingAddress: Address;
  paymentMethod: 'cod' | 'online';
  items?: any[];
  couponCode?: string | null;
}

export const placeOrder = async (payload: PlaceOrderPayload): Promise<Order> => {
  try {
    const { data } = await api.post<ApiResponse<Order>>('/orders', payload);
    return data.data;
  } catch {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const currentOrders = getStoreOrders();
    const newOrder: Order = {
      _id: `ord-${Date.now()}`,
      orderNumber: `ORD-${dateStr}-${randomDigits}`,
      user: 'usr-1',
      items: currentOrders[0]?.items || [],
      shippingAddress: payload.shippingAddress,
      pricing: {
        subtotal: 1677,
        discount: 0,
        couponDiscount: payload.couponCode ? 50 : 0,
        couponCode: payload.couponCode || undefined,
        shippingFee: 0,
        tax: 84,
        grandTotal: payload.couponCode ? 1711 : 1761,
      },
      paymentMethod: payload.paymentMethod,
      paymentStatus: payload.paymentMethod === 'online' ? 'paid' : 'pending',
      orderStatus: 'placed',
      statusHistory: [
        {
          status: 'placed',
          note: `Order placed via ${payload.paymentMethod.toUpperCase()}`,
          at: new Date().toISOString(),
        },
      ],
      deliveryEstimate: 'Thursday, 24 Sep 2026',
      createdAt: new Date().toISOString(),
    };

    return newOrder;
  }
};

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const { data } = await api.get<ApiResponse<Order[]>>('/orders');
    return data.data;
  } catch {
    return getStoreOrders();
  }
};

export const fetchOrderById = async (orderId: string): Promise<Order> => {
  try {
    const { data } = await api.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return data.data;
  } catch {
    const found = getStoreOrders().find((o) => o._id === orderId || o.orderNumber === orderId);
    if (!found) return getStoreOrders()[0];
    return found;
  }
};

export const useOrders = () => {
  return useQuery<Order[], Error>({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useOrder = (orderId: string) => {
  return useQuery<Order, Error>({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: Boolean(orderId),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: placeOrder,
    onSuccess: (newOrder) => {
      queryClient.setQueryData(['orders'], (old: Order[] = []) => [newOrder, ...old]);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(
        'Order Placed Successfully! 🎉',
        `Order #${newOrder.orderNumber} has been confirmed.`
      );
    },
    onError: (err: any) => {
      toast.error('Order Placement Failed', err?.message || 'Please check payment and retry.');
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: Order['orderStatus'] }) => {
      try {
        const { data } = await api.patch<ApiResponse<Order>>(`/orders/${orderId}/status`, { status });
        return data.data;
      } catch {
        const updated = updateOrderStatusInStore(orderId, status);
        if (!updated) throw new Error('Order not found');
        return updated;
      }
    },
    onSuccess: (updatedOrder) => {
      // Invalidate customer orders query key & detail query key & admin stats immediately
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', updatedOrder._id] });
      queryClient.invalidateQueries({ queryKey: ['order', updatedOrder.orderNumber] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });

      // Emit real-time WebSocket event to shopper's tracking room
      emitGlobalSocketMutation(`order:${updatedOrder._id}`, 'order:statusChanged', {
        orderId: updatedOrder._id,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.orderStatus,
      });
      if (updatedOrder.orderNumber) {
        emitGlobalSocketMutation(`order:${updatedOrder.orderNumber}`, 'order:statusChanged', {
          orderId: updatedOrder._id,
          orderNumber: updatedOrder.orderNumber,
          status: updatedOrder.orderStatus,
        });
      }

      toast.success(
        'Order Status Updated',
        `Order #${updatedOrder.orderNumber} is now marked as ${updatedOrder.orderStatus.toUpperCase()}.`
      );
    },
    onError: (err: any) => {
      toast.error('Status Update Failed', err?.message || 'Could not update order status.');
    },
  });
};
