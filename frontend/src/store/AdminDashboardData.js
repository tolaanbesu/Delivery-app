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

// NEW: Growth Calculation Helper
const calculateGrowth = (current, previous) => {
  if (previous === 0) return current > 0 ? "+100%" : "+0%";
  const growth = ((current - previous) / previous) * 100;
  return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
};

/* =========================
   PERIOD FILTERS
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

// NEW: Previous Period Filter for Comparison
const filterByPreviousPeriod = (items, dateKey, period) => {
  return items.filter(item => {
    const d = new Date(item[dateKey]);
    if (period === "Today") {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      return sameDay(d, yesterday);
    }
    if (period === "Week") {
      const startThisWeek = new Date(now);
      startThisWeek.setDate(now.getDate() - now.getDay());
      const startLastWeek = new Date(startThisWeek);
      startLastWeek.setDate(startLastWeek.getDate() - 7);
      return d >= startLastWeek && d < startThisWeek;
    }
    if (period === "Month") {
      const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      return d.getMonth() === lastMonth && d.getFullYear() === year;
    }
    if (period === "Year") return d.getFullYear() === now.getFullYear() - 1;
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
    // Current Period Data
    const periodOrders = filterByPeriod(orders, "createdAt", period);
    const periodUsers = filterByPeriod(users, "memberSince", period);
    
    // Previous Period Data (for comparison)
    const prevOrders = filterByPreviousPeriod(orders, "createdAt", period);
    const prevUsers = filterByPreviousPeriod(users, "memberSince", period);

    // Revenue Calculations
    const currentRevenue = periodOrders.reduce((sum, o) => sum + Number(o.grandTotal || o.total || o.price || 0), 0);
    const prevRevenue = prevOrders.reduce((sum, o) => sum + Number(o.grandTotal || o.total || o.price || 0), 0);

    // Active Orders Calculation
    const activeCount = periodOrders.filter(o => 
      o.status !== "completed" && 
      o.boardStatus !== "Done"
    ).length;

    const prevActiveCount = prevOrders.filter(o => 
      o.status !== "completed" && 
      o.boardStatus !== "Done"
    ).length;

    periodStats[period] = {
      totalRevenue: formatMoney(currentRevenue),
      revenueGrowth: calculateGrowth(currentRevenue, prevRevenue),
      activeOrders: activeCount.toString(),
      activeOrdersGrowth: calculateGrowth(activeCount, prevActiveCount),
      newUsers: periodUsers.length.toString(),
      newUsersGrowth: calculateGrowth(periodUsers.length, prevUsers.length),
      trendsTotal: formatMoney(currentRevenue * 0.35),
      trendsGrowth: calculateGrowth(currentRevenue, prevRevenue)
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