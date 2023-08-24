const formatDate = (createdAtVal) => {
    return new Date(createdAtVal).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
};
  
module.exports = { formatDate };