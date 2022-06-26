
// Attributtes
const ROW_IDX = 'data-row-idx';
const COLUMN_IDX = 'data-column-idx';
const SQUARE_IDX = 'data-square-idx';

let squareIDX = (r, c) => {
	if (r <= 3) {
		if (c <= 3) {
			return 1;
		} else if (c <= 6) {
			return 2;
		} else if (c <= 9) {
			return 3;
		}
	} else if (r <= 6) {
		if (c <= 3) {
			return 4;
		} else if (c <= 6) {
			return 5;
		} else if (c <= 9) {
			return 6;
		}
	} else if (r <= 9) {
		if (c <= 3) {
			return 7;
		} else if (c <= 6) {
			return 8;
		} else if (c <= 9) {
			return 9;
		}
	}
}

export default class Sudoku {

	constructor() {
		this.board = this.createBoard();
		this.selectedCell = null;

		window.addEventListener('resize', _ => {
			let size = Math.min(innerWidth, innerHeight) - 100;
			this.board.style.width = `${size}px`;
			this.board.style.height = `${size}px`;
		});
	}

	get selectedColumnIDX() {
		return parseInt(this.selectedCell.getAttribute(COLUMN_IDX));
	}

	get selectedRowIDX() {
		return parseInt(this.selectedCell.getAttribute(ROW_IDX));
	}

	get selectedSquareIDX() {
		return parseInt(this.selectedCell.getAttribute(SQUARE_IDX));
	}

	get selectedColumnCells() {
		return this.board.querySelectorAll(`[${COLUMN_IDX}="${this.selectedColumnIDX}"]`);
	}

	get selectedRowCells() {
		return this.board.querySelectorAll(`[${ROW_IDX}="${this.selectedRowIDX}"]`);
	}

	get selectedSquareCells() {
		return this.board.querySelectorAll(`[${SQUARE_IDX}="${this.selectedSquareIDX}"]`);
	}

	createBoard() {
		let table = document.createElement('table');

		for (var row = 1; row <= 9; ++row) {
			let tr = document.createElement('tr');
			for (var column = 1; column <= 9; ++column) {
				let td = document.createElement('td');

				td.setAttribute(ROW_IDX, row);
				td.setAttribute(COLUMN_IDX, column);
				td.setAttribute(SQUARE_IDX, squareIDX(row, column));
				td.textContent = squareIDX(row, column)

				this.listen(td);
				tr.appendChild(td);
			}

			table.appendChild(tr);
		}

		let size = Math.min(innerWidth, innerHeight) - 100;
		table.style.width = `${size}px`;
		table.style.height = `${size}px`;

		return table;
	}

	listen(cell) {
		cell.addEventListener('click', (event) => {
			this.select(event.target);
		}, false);
	}

	unselectCell() {
		if (!this.selectedCell) return;

		let classNameRemover = _ => {
			if (_ !== this.selectedCell && _.classList.contains('highlight'))
				_.classList.remove('highlight');
		}

		this.selectedColumnCells.forEach(classNameRemover);
		this.selectedRowCells.forEach(classNameRemover);
		this.selectedSquareCells.forEach(classNameRemover);
		this.selectedCell.classList.remove('selected');

		this.selectedCell = null;
	}

	select(cell) {
		this.unselectCell();
		this.selectedCell = cell
		this.selectedCell.classList.add('selected');

		let addClass = _ => {
			if (_ !== cell && !_.classList.contains('highlight'))
				_.classList.add('highlight');
		}

		this.selectedColumnCells.forEach(addClass);
		this.selectedRowCells.forEach(addClass);
		this.selectedSquareCells.forEach(addClass);
	}
}
