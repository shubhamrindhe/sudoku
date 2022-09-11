
// https://www.w3schools.com/css/css_attribute_selectors.asp
// Attributtes
const ROW_IDX = 'data-row-idx';
const COLUMN_IDX = 'data-column-idx';
const SQUARE_IDX = 'data-square-idx';
const SUDOKU_CELL_IDX = 'data-sudoku-cell-idx';
const SUDOKU_CELL_VALUE = 'data-sudoku-cell-value';

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

	get selectedValue() {
		return parseInt(this.selectedCell.getAttribute(SUDOKU_CELL_VALUE));
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

	get selectedValueCells() {
		return this.board.querySelectorAll(`[${SUDOKU_CELL_VALUE}="${this.selectedValue}"]`);
	}

	createBoard() {
		let table = document.createElement('table');
		table.setAttribute('id', 'SUDOKU');

		for (var row = 0; row < 9; ++row) {
			let tr = document.createElement('tr');
			for (var column = 0; column < 9; ++column) {
				let td = document.createElement('td');

				td.setAttribute(ROW_IDX, row);
				td.setAttribute(COLUMN_IDX, column);
				td.setAttribute(SQUARE_IDX, this.squareIDX(row, column));
				td.setAttribute(SUDOKU_CELL_IDX, row * 9 + column);
				td.textContent = row * 9 + column;//this.squareIDX(row, column);

				this.listen(td);
				tr.appendChild(td);
			}

			table.appendChild(tr);
		}

		let size = Math.min(innerWidth, innerHeight) - 100;
		table.style.setProperty('--size', `${size}px`);

		return table;
	}

	squareIDX(r, c) {
		return Math.floor(r / 3) * 3 + Math.floor(c / 3);
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

		this.selectedValueCells.forEach(_ => {
			if (_ !== this.selectedCell && _.classList.contains('selectedValued'))
				_.classList.remove('selectedValued');
		});

		this.selectedCell = null;
	}

	select(cell) {
		this.unselectCell();
		this.selectedCell = cell
		this.selectedCell.classList.add('selected');

		this.selectedValueCells.forEach(_ => {
			if (_ !== cell && !_.classList.contains('selectedValued'))
				_.classList.add('selectedValued');
		});

		let addClass = _ => {
			if (_ !== cell && !_.classList.contains('highlight'))
				_.classList.add('highlight');
		}

		this.selectedColumnCells.forEach(addClass);
		this.selectedRowCells.forEach(addClass);
		this.selectedSquareCells.forEach(addClass);
	}

	showErrorsForCells(cellidxs) {
		cellidxs.forEach(_ => {
			document.querySelector(`[data-sudoku-cell-idx="${_}"]`).classList.add('highlight-error');
		});
	}

	configure(data) {
		let cells = this.board.querySelectorAll('td');
		if (typeof data == 'string') {
			for (var i = 0; i < data.length; ++i) {
				this.registerCell(cells[i], data.charAt(i));
			}
		} else if (data instanceof Array) {
			if (data.length == 81) {
				for (var i = 0; i < data.length; ++i) {
					this.registerCell(cells[i], data[i]);
				}
			} else {

			}
		}
	}

	registerCell(cell, value) {
		cell.textContent = value;
		cell.setAttribute(SUDOKU_CELL_VALUE, value == 0 ? ' ' : value);
	}

	validate() {
		let data = [];
		for (var [index, node] of this.board.querySelectorAll('td').entries()) {
			data.push(parseInt(node.getAttribute(SUDOKU_CELL_VALUE)));
		}

		// function splitArray(array, part) {
		// 	var tmp = [];
		// 	for (var i = 0; i < array.length; i += part) {
		// 		tmp.push(array.slice(i, i + part));
		// 	}
		// 	return tmp;

		// 	return array;
		// }

		return Sudoku.isValidSudoku(data);
	}

	static isValidSudoku(board) {
		let hashSet = new Set();
		let hashMap = new Map();

		let validation = {
			isValid: true,
			duplicate: new Set()
		}

		for (let [index, data] of board.entries()) {
			let r = Math.floor(index / 9);
			let c = index % 9;
			let s = (Math.floor(r / 3) * 3) + Math.floor(c / 3);

			let S_IDX = `s${s}${data}`;
			let R_IDX = `r${r}${data}`;
			let C_IDX = `c${c}${data}`;

			for (let hash of [S_IDX, R_IDX, C_IDX]) {
				if (hashSet.has(hash)) {
					validation.isValid = false;
					validation.duplicate.add(hashMap.get(hash));
					validation.duplicate.add(index);
				}

				hashSet.add(hash);
				hashMap.set(hash, index);
			}
		}

		return validation;
	}
}

class SudokuGame {

	constructor() {
		let data = (new Array(81)).fill(0);
		this.hashSet = new Set();

		Array.from({ length: 9 }, (_, i) => i + 1);
	}

	generateSudoku() {

	}
}
