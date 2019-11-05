const words = require("./data/dictionary.json").filter(w => w.length < 9);

/*
 */

class BoardSolver {
  constructor() {
  }

  solveBoard(board) {
    let res = [];

    function buildTrie() {
      const root = {};
      for (let w of words) {
        let node = root;
        for (let c of w) {
          if (node[c] == null) node[c] = {};
          node = node[c];
        }
        node.word = w;
      }
      return root;
    }

    function search(node, i, j) {
      if (node.word != null) {
        res.push(node.word);
        node.word = null;   // make sure only print one time for each word
      }

      if (i < 0 || i >= board.length || j < 0 || j >= board[0].length) return;
      if (node[board[i][j]] == null) return;

      const c = board[i][j];
      board[i][j] = '#';  // mark visited

      // Right
      search(node[c], i + 1, j);

      // Left
      search(node[c], i - 1, j);

      // Below
      search(node[c], i, j + 1);

      // Above
      search(node[c], i, j - 1);

      // Diagonal up-left
      search(node[c], i - 1, j - 1);

      // Diagonal up-right
      search(node[c], i + 1, j - 1);

      // Diagonal down-right
      search(node[c], i + 1, j + 1);

      // Diagonal down-left
      search(node[c], i - 1, j + 1);

      board[i][j] = c;  // reset
    }

    const root = buildTrie();
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        search(root, i, j);
      }
    }
    return res;
  }
  
  solve(tiles) {
    const sortedTiles = []

    // Sort by y
    tiles.sort((a, b) => a.y - b.y)

    for (let i = 0; i < 4; i++) {
      // Grab the next 4 tiles
      const nextRow = tiles.splice(0, 4);

      nextRow.sort((a, b) => a.x - b.x)
      sortedTiles.push(...nextRow)
    }

    const board = [
      ["#", "#", "#", "#"],
      ["#", "#", "#", "#"],
      ["#", "#", "#", "#"],
      ["#", "#", "#", "#"],
    ]

    let col = 0;
    let row = 0;
    sortedTiles.forEach(tile => {
      board[row][col] = tile.label;
      col += 1;

      if(col > 3) {
        col = 0;
        row += 1;
      }
    })

    console.log(board);

    const solutions = this.solveBoard(board);
    solutions.sort((a, b) => b.length - a.length)

    console.log(solutions.slice(0, 30));
  }
}

module.exports = BoardSolver;