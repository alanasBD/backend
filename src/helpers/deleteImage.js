const fs = require("fs").promises;
const deleteImage = async () => {
  try {
    await fs.access(userImagePath);
    await fs.unlink(userImagePath);
    console.log("Image is deleted successfully.");
  } catch (error) {
    console.error("User image doesn't exit");
  }
};

module.exports = {
  deleteImage,
};
