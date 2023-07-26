import Component from './component';
import { CarData, WinnerData } from '../types/interfaces';
import { createBlock, findElement } from './helpers';
import Api from './api';

class WinnersTable extends Component {
  public static winnersNumber: number;

  private api: Api;

  public static winnersData: WinnerData[] | [];

  public static pageNum: number;

  public static limit: number;

  constructor(tag: keyof HTMLElementTagNameMap, className: string) {
    super(tag, className);
    this.api = new Api();
    WinnersTable.pageNum = 1;
    WinnersTable.limit = 10;
  }

  public async render(): Promise<HTMLElement> {
    this.container.innerHTML = '';

    WinnersTable.winnersData = await this.api.getWinners();
    WinnersTable.winnersNumber = WinnersTable.winnersData.length;

    const winnersTitle = createBlock({
      tag: 'h2',
      className: 'winners-title',
      innerHTML: `Winners (${WinnersTable.winnersNumber})`,
      parentBlock: this.container,
    });

    this.renderWinnersTable();

    return this.container;
  }

  public renderWinnersTable():HTMLElement {
    this.container.innerHTML = '';
    console.log(WinnersTable.winnersData);

    const winnersTableContainer = createBlock({
      tag: 'div',
      className: 'winners-table-container',
      parentBlock: this.container,
    });
    const page = createBlock({
      tag: 'h3',
      className: 'winners-table-container__page',
      innerHTML: `Page #${WinnersTable.pageNum}`,
      parentBlock: winnersTableContainer,
    });
    const winnersTable = createBlock({
      tag: 'div',
      className: 'winners-table-container__table winners-table',
      parentBlock: winnersTableContainer,
    });

    this.renderWinnersTableHead(winnersTable);
    this.renderWinnersTableData(winnersTable);

    const sortContainer = createBlock({
      tag: 'div',
      className: 'winners-table-container__sort-container sort--container',
      parentBlock: winnersTableContainer,
    });

    const sortByWins = this.renderSortBtns('wins');
    const sortByTime = this.renderSortBtns('time');
    sortContainer.append(sortByWins);
    sortContainer.append(sortByTime);

    return this.container;
  }

  private renderSortBtns(category: string): HTMLElement {
    const sortBtnsContainer = createBlock({
      tag: 'div',
      className: `winners-table-container__sort-container sort-btns-container sort-btns-container_${category}`,
    });
    const sortContainerText = createBlock({
      tag: 'div',
      className: 'sort-btns-container__text',
      innerHTML: `Sort by ${category}: `,
      parentBlock: sortBtnsContainer,
    });
    const btnSortASC = createBlock({
      tag: 'button',
      className: 'sort-btns-container__btn btn',
      innerHTML: 'ASC',
      parentBlock: sortContainerText,
    });
    const btnSortDESC = createBlock({
      tag: 'button',
      className: 'sort-btns-container__btn btn',
      innerHTML: 'DESC',
      parentBlock: sortContainerText,
    });

    btnSortASC.addEventListener('click', this.btnSortHandler.bind(this));
    btnSortDESC.addEventListener('click', this.btnSortHandler.bind(this));

    return sortBtnsContainer;
  }

  public async btnSortHandler(e: Event):Promise<void> {
    const { target } = e;
    if (target && target instanceof HTMLElement) {
      let category:string;
      if (target.closest('.sort-btns-container')?.classList.contains('sort-btns-container_time')) {
        category = 'time';
      } else {
        category = 'wins';
      }
      const order = target.innerHTML;
      console.log('asctime');
      WinnersTable.winnersData = await this.api.getWinners(WinnersTable.pageNum, category, order);
      console.log(WinnersTable.winnersData);
      this.renderWinnersTable();
    }
  }

  private winnersTableCategories = [
    'Number', 'Car', 'Name', 'Wins', 'Best time',
  ];

  public renderWinnersTableHead(table: HTMLElement):void {
    const winnersTableHeadRow = createBlock({
      tag: 'tr',
      className: 'winners-table__head-row winners-table-head-row',
      parentBlock: table,
    });

    this.winnersTableCategories.forEach((category) => {
      const winnersTableHeadData = createBlock({
        tag: 'th',
        className: 'winners-table-head-row__data',
        innerHTML: category,
        parentBlock: winnersTableHeadRow,
      });
    });
  }

  public async renderWinnersTableData(table: HTMLElement):Promise<void> {
    const data = WinnersTable.winnersData;

    data.forEach(async (winner, index) => {
      const winnersTableDataRow = createBlock({
        tag: 'tr',
        className: 'winners-table__row winners-table-row',
        parentBlock: table,
      });

      const winnersTableDataNum = createBlock({
        tag: 'td',
        className: 'winners-table-row__data table-data_num',
        innerHTML: `${index + 1}`,
        parentBlock: winnersTableDataRow,
      });

      const winnersTableDataImage = createBlock({
        tag: 'td',
        className: 'winners-table-row__data table-data_image',
        innerHTML: `<svg width="35px" height="35px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" fill="none" width="35" height="35"/>
        <g>
        <circle cx="14" cy="13.5" r="1.5"/>
        <path d="M16.1 9h-1.6c-.6-2.7-3.2-4.5-5.9-3.9C6.6 5.5 5 7 4.6 9h-.7c-1 0-1.9.9-1.9 1.9v1.3c0 .7.6 1.3 1.3 1.3h.3c0-1.3 1.1-2.4 2.4-2.4 1.3 0 2.4 1.1 2.4 2.4h3.2c0-1.3 1.1-2.4 2.4-2.4 1.3 0 2.4 1.1 2.4 2.4h.3c.7 0 1.3-.6 1.3-1.3V11c0-1.1-.9-2-1.9-2zM6.2 9c.5-1.9 2.5-2.9 4.3-2.4 1.1.3 2 1.2 2.4 2.4H6.2zM6 12c-.8 0-1.5.7-1.5 1.5S5.2 15 6 15s1.5-.7 1.5-1.5S6.8 12 6 12z"/>
        </g>
        </svg>`,
        parentBlock: winnersTableDataRow,
      });

      const carData = await this.api.getCar(winner.id);

      const { color } = carData;

      winnersTableDataImage.style.fill = color;

      const winnersTableDataName = createBlock({
        tag: 'td',
        className: 'winners-table-row__data table-data_name',
        innerHTML: `${carData.name}`,
        parentBlock: winnersTableDataRow,
      });

      const winnersTableDataWins = createBlock({
        tag: 'td',
        className: 'winners-table-row__data table-data_wins',
        innerHTML: `${winner.wins}`,
        parentBlock: winnersTableDataRow,
      });

      const winnersTableDataTime = createBlock({
        tag: 'td',
        className: 'winners-table-row__data table-data_time',
        innerHTML: `${winner.time}`,
        parentBlock: winnersTableDataRow,
      });

      winnersTableDataTime.addEventListener('click', this.sortWinners);
    });
  }

  public sortWinners():void {
    console.log('sort');
  }
}

export default WinnersTable;
