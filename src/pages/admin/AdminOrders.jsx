import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Search, Filter, AlertCircle, RefreshCw, ShoppingBag } from "lucide-react";

const STATUSES = [
  "all",
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "delivered",
  "cancelled",
];

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-100   text-blue-700   border-blue-200",
  preparing: "bg-orange-100 text-orange-700 border-orange-200",
  ready: "bg-green-100  text-green-700  border-green-200",
  delivered: "bg-gray-100   text-gray-600   border-gray-200",
  cancelled: "bg-red-100    text-red-600    border-red-200",
};

export default function AdminOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("orders")
        .select(
          `
          *,
          profiles (
            full_name,
            email
          )
        `,
        )
        .order("created_at", { ascending: false });

      if (filter !== "all") query = query.eq("status", filter);

      const { data, error: err } = await query;
      if (err) throw err;
      setOrders(data || []);
    } catch (err) {
      console.error("Orders fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // Add at top of AdminOrders component
  const [view, setView] = useState("orders"); // 'orders' | 'bookings'
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Add booking fetch
  const fetchBookings = async () => {
    setBookingsLoading(true);
    const { data, error } = await supabase
      .from("event_bookings")
      .select("*, profiles(full_name, email)")
      .order("created_at", { ascending: false });

    if (!error) setBookings(data || []);
    setBookingsLoading(false);
  };

  useEffect(() => {
    if (view === "bookings") fetchBookings();
  }, [view]);

  const updateBookingStatus = async (bookingId, newStatus) => {
    const { error } = await supabase
      .from("event_bookings")
      .update({ status: newStatus })
      .eq("id", bookingId);

    if (error) {
      toast.error("Failed to update");
    } else {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)),
      );
      toast.success(`Booking marked as ${newStatus}`);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchOrders();
  }, [user, filter]);

  // Realtime subscription — new orders pop up instantly
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("admin-orders")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          setOrders((prev) => [payload.new, ...prev]);
          toast.success(`New order: ${payload.new.dish_name}`, { icon: "🍽️" });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          setOrders((prev) =>
            prev.map((o) =>
              o.id === payload.new.id ? { ...o, ...payload.new } : o,
            ),
          );
        },
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  const updateStatus = async (orderId, newStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      toast.error(`Failed to update: ${error.message}`);
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
      toast.success(`Order marked as ${newStatus}`);
    }
  };

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.dish_name?.toLowerCase().includes(q) ||
      o.user_email?.toLowerCase().includes(q) ||
      o.profiles?.full_name?.toLowerCase().includes(q) ||
      o.profiles?.email?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="p-8">
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse mb-8" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-white border border-gold/15 p-5 animate-pulse"
            >
              <div className="flex justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
                <div className="h-8 bg-gray-200 rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 shrink-0" />
            <div>
              <h3 className="font-body font-medium text-red-700 mb-1">
                Failed to load orders
              </h3>
              <p className="text-red-600 text-sm font-body mb-3">{error}</p>
              <button
                onClick={fetchOrders}
                className="flex items-center gap-2 bg-red-500 text-white text-xs
                  tracking-widest uppercase px-6 py-2 hover:bg-red-600 font-body"
              >
                <RefreshCw size={12} /> Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-light text-charcoal">
            Orders
          </h1>
          <p className="text-warm-gray font-body text-sm mt-1">
            {orders.length} total · Live updates on
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 border border-warm-gray/30 text-warm-gray
            text-xs tracking-widest uppercase px-4 py-2 hover:border-gold hover:text-gold
            transition-all font-body"
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>
      {/* View toggle */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "orders", label: "Food Orders" },
          { key: "bookings", label: "Event Bookings" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className={`px-5 py-2.5 text-xs font-body tracking-widest uppercase
        border transition-all
        ${
          view === key
            ? "bg-charcoal text-cream border-charcoal"
            : "bg-white text-warm-gray border-warm-gray/30 hover:border-gold"
        }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Show bookings when that view is active */}
      {view === "bookings" && (
        <div className="space-y-3">
          {bookingsLoading ? (
            <div className="flex justify-center py-20">
              <div
                className="w-8 h-8 border-2 border-gold border-t-transparent
          rounded-full animate-spin"
              />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gold/15">
              <p className="font-display text-2xl font-light text-charcoal">
                No event bookings yet
              </p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-gold/15 p-5"
              >
                <div
                  className="flex flex-col sm:flex-row sm:items-center
          justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="font-display text-lg font-semibold">
                        {booking.service_title}
                      </h3>
                      <span
                        className={`text-xs font-body px-2 py-0.5 border
                capitalize ${
                  booking.status === "pending"
                    ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                    : booking.status === "confirmed"
                      ? "bg-blue-100 text-blue-700 border-blue-200"
                      : booking.status === "in_progress"
                        ? "bg-orange-100 text-orange-700 border-orange-200"
                        : booking.status === "completed"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-100 text-red-600 border-red-200"
                }`}
                      >
                        {booking.status.replace("_", " ")}
                      </span>
                    </div>
                    <div
                      className="flex flex-wrap gap-x-4 gap-y-1 text-xs
              text-warm-gray font-body"
                    >
                      <span>
                        👤{" "}
                        {booking.profiles?.full_name ||
                          booking.user_email ||
                          "Guest"}
                      </span>
                      {booking.form_data?.date && (
                        <span>
                          📅{" "}
                          {new Date(booking.form_data.date).toLocaleDateString(
                            "en-GB",
                          )}
                        </span>
                      )}
                      {(booking.form_data?.guests ||
                        booking.form_data?.participants) && (
                        <span>
                          👥{" "}
                          {booking.form_data.guests ||
                            booking.form_data.participants}{" "}
                          guests
                        </span>
                      )}
                      <span>
                        {new Date(booking.created_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                    {booking.notes && (
                      <p className="text-xs text-warm-gray/60 font-body mt-1 italic">
                        Note: {booking.notes}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0">
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        updateBookingStatus(booking.id, e.target.value)
                      }
                      className="text-xs font-body border border-warm-gray/30 px-2
                py-1.5 focus:border-gold focus:outline-none bg-white"
                    >
                      {[
                        "pending",
                        "confirmed",
                        "in_progress",
                        "completed",
                        "cancelled",
                      ].map((s) => (
                        <option key={s} value={s} className="capitalize">
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2
            text-warm-gray pointer-events-none"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by dish, customer name or email..."
            className="w-full pl-9 pr-4 py-2.5 border border-warm-gray/30 bg-white
              font-body text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter size={14} className="text-warm-gray shrink-0" />
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 text-xs font-body tracking-wide capitalize
                whitespace-nowrap border transition-all
                ${
                  filter === s
                    ? "bg-charcoal text-cream border-charcoal"
                    : "bg-white text-warm-gray border-warm-gray/30 hover:border-gold"
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gold/15">
          <ShoppingBag size={40} className="text-warm-gray/20 mx-auto mb-4" />
          <p className="font-display text-2xl font-light text-charcoal">
            No orders found
          </p>
          <p className="text-warm-gray font-body text-sm mt-2">
            {search
              ? "Try a different search term"
              : "Orders will appear here when placed"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order.id} className="bg-white border border-gold/15 p-5">
              <div
                className="flex flex-col sm:flex-row sm:items-center
                justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="font-display text-lg font-semibold truncate">
                      {order.dish_name}
                    </h3>
                    <span
                      className={`text-xs font-body px-2 py-0.5 border
                      capitalize shrink-0 ${STATUS_COLORS[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div
                    className="flex flex-wrap gap-x-4 gap-y-1 text-xs
                    text-warm-gray font-body"
                  >
                    <span>
                      👤{" "}
                      {order.profiles?.full_name || order.user_email || "Guest"}
                    </span>
                    <span>Qty: {order.quantity}</span>
                    <span className="capitalize">{order.order_type}</span>
                    <span>
                      {new Date(order.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {order.addons?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {order.addons.map((a, i) => (
                        <span
                          key={i}
                          className="text-xs border border-gold/20
                          px-2 py-0.5 text-warm-gray font-body"
                        >
                          {a.label} +${a.price}
                        </span>
                      ))}
                    </div>
                  )}
                  {order.special_instructions && (
                    <p className="text-xs text-warm-gray/60 font-body mt-1 italic">
                      Note: {order.special_instructions}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="font-display text-xl text-gold">
                    ${order.total?.toFixed(2)}
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="text-xs font-body border border-warm-gray/30 px-2
                      py-1.5 focus:border-gold focus:outline-none bg-white"
                  >
                    {STATUSES.filter((s) => s !== "all").map((s) => (
                      <option key={s} value={s} className="capitalize">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
