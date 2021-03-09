const cloudinary = require("cloudinary");
const User = require("../models/userModel");

cloudinary.config({
  cloud_name: "taufikcloud",
  api_key: "422422365967877",
  api_secret: "dg-Eji1DD2FNtvUb7GAFnWTRJvo",
});

module.exports = {
  UploadImage(req, res) {
    cloudinary.uploader.upload(req.body.image, async result => {
      console.log(result);

      await User.update(
        {
          _id: req.user._id,
        },
        {
          $push: {
            images: {
              imgId: result.public_id,
              imgVersion: result.version,
            },
          },
        }
      )
        .then(() =>
          res.status(200).json({ message: "Image upload successfully" })
        )
        .catch((err) =>
          res.status(500).json({ message: "Error Uploading Image" })
        );
    });
  },
};
