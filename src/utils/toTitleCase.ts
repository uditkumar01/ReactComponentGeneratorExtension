const toTitleCase = (oldStr: string) => {
  return oldStr
    .replace(/\W/g, " ")
    .replace(/_/g, " ")
    .split(" ")
    .map((piece) => {
      if (piece.length) {
        return piece[0].toUpperCase() + piece.slice(1, piece.length);
      }
    })
    .join("");
};

export default toTitleCase;
