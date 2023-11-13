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
    
    console.log(userCountByMonth);
    res.render('statistics/bar', { userCountByMonth });
}