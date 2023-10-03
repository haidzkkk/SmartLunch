
var Status = require('../models/status')


exports.status = async (req, res, next) =>{
    try{
        const data = await Status.find()
        res.status(200).json(data)
    }catch(err){
        res.status(400).json(err)   
    }
}



exports.addstatus= async (req, res, next) =>{
    try{
        var status = req.body;
        await Status.create(status);
        res.status(200).json("add thành công");
    }catch(err){
        res.status(400).json("add thất bại");
    }
}

exports.deletestatus = async (req, res, next) =>{
    const id = req.params.id;
    try {
      const status = await Status.findOneAndDelete({
        _id: id
      });
      if (!status) {
        return res.status(404).json({ error: "Không tìm thấy status" });
      }
      res.json({ message: "Xoá status thành công" });
    } catch (error) {
      res.status(500).json({ error: "Lỗi xoá status" });
    }
  }


  exports.updatestatus = async (req, res, next) =>{
    try {
        const id = req.params.id;
        const { status_name, status_description } = req.body;
        const status = await Status.findOne({
          _id: id,
        });
        if (!status) {
          return res.status(404).json({ error: "Status not found" });
        }
        status.status_name = status_name;
        status.status_description = status_description;
        const updatedStatus = await status.save();
        res.json(updatedStatus);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating status" });
      }
}
  
  