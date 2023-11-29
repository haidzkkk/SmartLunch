var Order = require("../models/order.js");
 exports.getStatistics = async (req, res) => {

    res.render('statistics/statistics', {  layout: "layouts/home" });
}


exports.getUser = async (req, res) => {
    const response = await fetch('http://localhost:3000/api/users');
    const data = await response.json();
    
    const userCountByMonth = {};

    for (let i = 0; i < data.length; i++) {
      const month = parseInt(data[i].createdAt.split("-")[1]);
    
      // Kiểm tra xem tháng đã tồn tại trong đối tượng chưa
      if (userCountByMonth.hasOwnProperty(month)) {
        // Nếu tồn tại, tăng giá trị lên 1
        userCountByMonth[month]++;
      } else {
        // Nếu không tồn tại, tạo mới và gán giá trị là 1
        userCountByMonth[month] = 1;
      }
    }
    

    
    res.render('statistics/chartuser', { userCountByMonth });
}
exports.getOrderbyMonth = async (req, res) => {
  const response = await fetch('http://localhost:3000/api/getorder');
  const data = await response.json();
  
  const userCountByMonth = {};

  for (let i = 0; i < data.length; i++) {
    const month = parseInt(data[i].createdAt.split("-")[1]);
  
    // Kiểm tra xem tháng đã tồn tại trong đối tượng chưa
    if (userCountByMonth.hasOwnProperty(month)) {
      // Nếu tồn tại, tăng giá trị lên 1
      userCountByMonth[month]++;
    } else {
      // Nếu không tồn tại, tạo mới và gán giá trị là 1
      userCountByMonth[month] = 1;
    }
  }
  

  
  res.render('statistics/chartorder', { userCountByMonth });
}
exports.getSortedbyview = async (req, res) => {
  const response = await fetch('http://localhost:3000/api/productbyadmin/products');
  const data = await response.json();
  
  // Sort the data by views in descending order
  data.sort((a, b) => b.views - a.views);
  
  // Take the top 5 items
  const top5views = data.slice(0, 5).map(item => ({
    product_name: item.product_name,
    views: item.views
  }));
  
  // Now, top5views contains an array of objects with product_name and views of the top 5 products
  console.log(top5views);
  res.render('statistics/sortedbyview', {top5views });
}
exports.getOrderbyadmin= async (req, res) => {
  try {
    const order = await Order.find();
    return res.status(200).json(
      order
    );
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
exports.getOrderPie = async (req, res) => {
    const response = await fetch('http://localhost:3000/api/getorder');
    const data = await response.json();

    // Khởi tạo đối tượng đếm số lượng sản phẩm cho mỗi trạng thái
    let statusCount = { total: 0, specificStatusCount: 0,orderCount: 0,cancelCount:0 ,money: 0};

    // Đếm số lượng sản phẩm cho mỗi trạng thái và kiểm tra trạng thái cụ thể
    data.forEach(order => {
      const status = order.status;
      statusCount.total++;

      if (status === '6526a6e6adce6a54f6f67d7d') {
        statusCount.orderCount++;
        statusCount.money += order.total;
      }
      if (status === '653bc0a72006e5791beab35b') {
        statusCount.cancelCount++;
      }
    });
    console.log(statusCount)
    // Truyền dữ liệu vào template để hiển thị
    res.render('dashboard/chartpie', { statusCount });
};
exports.getLinegraph = async (req, res) => {
  const response = await fetch('http://localhost:3000/api/getorder');
  const data = await response.json();
  const monthlyTotals = {};

// Lặp qua từng đơn hàng
data.forEach((order) => {
  // Lấy ngày tạo đơn hàng
  const createdAt = new Date(order.createdAt);

  // Trích xuất tháng và năm từ ngày tạo đơn hàng
  const monthYear = `${createdAt.getMonth() + 1}`;

  // Kiểm tra xem đã tồn tại tổng cho tháng đó chưa
  if (!monthlyTotals[monthYear]) {
    monthlyTotals[monthYear] = 0;
  }

  // Cộng tổng của đơn hàng hiện tại vào tổng của tháng đó
  monthlyTotals[monthYear] += order.total;
});
console.log(monthlyTotals);
  res.render('dashboard/linegraph',{monthlyTotals});
};
exports.getLinegraph2 = async (req, res) => {
  const response = await fetch('http://localhost:3000/api/getorder');
  const data = await response.json();
  const dailyTotals = [];

  // Function to format date as yyyy-mm-dd
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Loop through each order
  data.forEach((order) => {
    // Get the creation date of the order
    const createdAt = new Date(order.createdAt);

    // Extract the date as yyyy-mm-dd
    const orderDate = formatDate(createdAt);

    // Check if an entry for this date already exists in dailyTotals
    const existingEntry = dailyTotals.find((entry) => entry.date === orderDate);

    // If an entry exists, update the money field
    if (existingEntry) {
      existingEntry.money += order.total;
    } else {
      // If no entry exists, add a new entry
      dailyTotals.push({ date: orderDate, money: order.total });
    }
  });

  console.log(dailyTotals);
  res.render('dashboard/linegraph2', { dailyTotals });
};





