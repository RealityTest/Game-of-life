Game of Life
======================
This is a simple implementation of Conways Game of Life written in JavaScript. There's also a [demo](https://realitytest.github.io/Game-of-life/). Keep in mind that this is still in development. I will work on it whenever I find time to do so. You can leftclick and drag to create living cells or rightclick and drag to create dead cells.

The game rules are simple:
- On the canvas a living cell is represented by a green rectangle, whereas a dead one is white. The array represents them as 1 (alive) or 0 (dead).
- Any live cell with fewer than two live neighbors dies, as if caused by under population.
- Any live cell with two or three live neighbors lives on to the next generation.
- Any live cell with more than three live neighbors dies, as if by overpopulation.
- Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

[Source](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Rules)
