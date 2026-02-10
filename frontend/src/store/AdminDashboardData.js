// store/adminDashboardCalculator.js

const now = new Date();

/* =========================
   HELPERS
========================= */
const formatMoney = (num) => {
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  return `$${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

const sameDay = (a, b) =>
  a.getDate() === b.getDate() &&
  a.getMonth() === b.getMonth() &&
  a.getFullYear() === b.getFullYear();

/* =========================
   PERIOD FILTER
========================= */
const filterByPeriod = (items, dateKey, period) => {
  return items.filter(item => {
    const d = new Date(item[dateKey]);
    if (period === "Today") return sameDay(d, now);
    if (period === "Week") {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      return d >= start;
    }
    if (period === "Month")
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    if (period === "Year")
      return d.getFullYear() === now.getFullYear();
    return false;
  });
};

/* =========================
   MAIN GENERATOR
========================= */
export const generateAdminDashboardData = (users, orders) => {
  const periods = ["Today", "Week", "Month", "Year"];

  const periodStats = {};

  periods.forEach(period => {
    const periodOrders = filterByPeriod(orders, "createdAt", period);
    const periodUsers = filterByPeriod(users, "memberSince", period);

    const revenue = periodOrders.reduce(
      (sum, o) => sum + Number(o.total || o.price || 0),
      0
    );

    periodStats[period] = {
      totalRevenue: formatMoney(revenue),
      revenueGrowth: "+0%",
      activeOrders: periodOrders.filter(o => o.status === "active").length.toString(),
      activeOrdersGrowth: "+0%",
      newUsers: periodUsers.length.toString(),
      newUsersGrowth: "+0%",
      trendsTotal: formatMoney(revenue * 0.35),
      trendsGrowth: "+0%"
    };
  });

  return {
    periodStats,

    charts: {
      Today: Array.from({ length: 6 }, (_, i) => ({
        name: `${8 + i * 2}:00`,
        value: Math.floor(Math.random() * 100)
      })),
      Week: ["MON","TUE","WED","THU","FRI","SAT","SUN"].map(d => ({
        name: d,
        value: Math.floor(Math.random() * 100)
      })),
      Month: Array.from({ length: 4 }, (_, i) => ({
        name: `WK ${i + 1}`,
        value: Math.floor(Math.random() * 200)
      })),
      Year: ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"].map(m => ({
        name: m,
        value: Math.floor(Math.random() * 1000)
      }))
    },

    recentOrders: [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10),

    notifications: orders.slice(-3).map((o, i) => ({
      id: i + 1,
      title: "New Order",
      message: `Order ${o.id} received`,
      time: "Just now",
      type: "order"
    }))
  };
};
