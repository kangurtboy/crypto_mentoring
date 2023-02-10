<template>
	<div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
  <div  v-if="loader" class="fixed w-100 h-100 opacity-80 bg-purple-800 inset-0 z-50 flex items-center justify-center">
    <svg class="animate-spin -ml-1 mr-3 h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div>
  <div class="container">
    <section>
      <div class="flex">
        <div class="max-w-xs">
          <label for="wallet" class="block text-sm font-medium text-gray-700"
            >Тикер</label
          >
          <div class="mt-1 relative rounded-md shadow-md">
			<input 
			v-model="userInput"
			@keydown.enter="addTicker(userInput)"
			@input="onInput"
			type="text" 
			name="wallet" id="wallet"
			class="block w-full pr-10 border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md p-2 mb-1"
			placeholder="Например DOGE" />
          </div>
          <div v-if="suggestedTickers.length" class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap p-2">
            <span 
			v-for="(suggest , id) of suggestedTickers"
			:key="id"
			@click="addTicker(suggest)"
			class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
              {{suggest}}
            </span>
          </div>
          <div v-if="errorMessage" class="text-sm text-red-600">{{errorMessage}}</div>
        </div>
      </div>
      <button
		@click="addTicker(userInput)"
        type="button"
        class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        <!-- Heroicon name: solid/mail -->
        <svg
          class="-ml-0.5 mr-2 h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="#ffffff"
        >
          <path
            d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
          ></path>
        </svg>
        Добавить
      </button>
    </section>
	<div class="flex gap-4 items-center justify-center">
		<button
			v-if="page > 1"
			class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
			@click="paginationPrev"
			>Назад</button>
		<button
			class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
			@click="paginationNext"
			v-if="hasNextPage"
			>Вперед</button>
		<input type="text"
			placeholder="Поиск"
			class="block w-full pr-10 border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md p-2 mb-1 w-24 h-8"
			v-model="searchValue"
			>
	</div>
      <hr class="w-full border-t border-gray-600 my-4" />
      <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
		<div class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
		@click="selectTicker(ticker)"
		:class="{
			'border-4': currentTicker === ticker ,
		}"
			v-for="(ticker , id) of filteredTickers" :key="id">
          <div class="px-4 py-5 sm:p-6 text-center">
            <dt class="text-sm font-medium text-gray-500 truncate">
              {{ticker.name}} - USD
            </dt>
			<img v-if="tickerLoading && tickers[tickers.length - 1] === ticker" src="./assets/loader.gif" alt="" class="w-10 mx-auto">
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {{ticker.price}}
            </dd>
          </div>
          <div class="w-full border-t border-gray-200"></div>
		<button 
			@click.stop="removeTicker(ticker)"
			class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none">
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="#718096"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"
              ></path></svg>Удалить
          </button>
        </div>
      </dl>
	<h1 v-if="!tickers.length" class="text-xl text-center">Нет активных тикеров</h1>
      <hr class="w-full border-t border-gray-600 my-4" />
    <section class="relative" v-if="currentTicker">
      <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
        {{currentTicker.name}} - USD
      </h3>
	<div class="flex items-end border-gray-600 border-b border-l h-64">
		<div v-for="(stripe , id) of stripesPersentage" class="bg-purple-800 border w-10" 
		:key="id" 
		:style="{
			'height': `${stripe}%`
		}">
		</div>
	</div>
      <button
        type="button"
        class="absolute top-0 right-0"
		@click="reset">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xmlns:svgjs="http://svgjs.com/svgjs"
          version="1.1"
          width="30"
          height="30"
          x="0"
          y="0"
          viewBox="0 0 511.76 511.76"
          style="enable-background:new 0 0 512 512"
          xml:space="preserve"
        >
          <g>
            <path
              d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
              fill="#718096"
              data-original="#000000"
            ></path>
          </g>
        </svg>
      </button>
    </section>
  </div>
</div>
</template>

<script>
import { requestTickets } from './api';
import {getAllTickersName} from './api';
export default {
	data() {
		return {
			loader: false,
			tickerLoading: false,
			errorMessage: '',
			userInput: '',
			currentTicker: null,
			stripes: [],
			stripesPersentage: [],
			stripeInterval: null,
			allTickersName: [],
			suggestedTickers: [],
			tickers: [],
			paginationCount: 6,
			page: 1,
			searchValue: '',
		}
	},

	methods : {
		addTicker(data) {
			//добавление тикеров
			if (this.userInput || data) {
				this.errorMessage = '';
				this.tickers.forEach(item => {
					if (item.name === this.userInput.toUpperCase() || item.name === data.toUpperCase()) {
						this.errorMessage = 'Такой тикер уже добавлен';
					}
				});
				
				if (!this.errorMessage) {
					this.tickerLoading = true;
					this.tickers.push({});
					requestTickets(data).then(r => {
						this.tickers[this.tickers.length - 1] = {
							name: data.toUpperCase(),
							price: r.USD
						};
						this.tickerLoading = false;
						this.userInput = '';
						this.suggestedTickers = [];
					});
				}
			}
		},

		removeTicker(ticker) {
			//удаление тикеров
			this.tickers = this.tickers.filter((item => item !== ticker));
			this.reset();
		},

		selectTicker(ticker) {
			//выборка тикеров
			if (this.currentTicker) {		
				this.reset();
			}
			this.renderStripes();
			this.currentTicker = ticker;
		},
		async renderStripes() {
			//отрисовка столбиков для показа графика тикера
			this.stripesPersentage = [];
			this.stripes = [];
			this.stripeInterval = setInterval(() => {
				if (this.currentTicker) {
					requestTickets(this.currentTicker.name).then(
						r => {
							this.stripes.push(r.USD);
							const min = Math.min(...this.stripes);
							const minPersent = 50;
							const persentage = Math.floor(((r.USD - min) * 100) / 100) + minPersent;
							this.stripesPersentage.push(persentage);
						}
					);
				}
			}, 3000);		
		},

		onInput() {
			//обработчик поля ввыода для добавленя тикера
			this.errorMessage = '';
			this.suggestedTickers = [];
			for (let item in this.allTickersName) {
				if (item.startsWith(this.userInput.toUpperCase()) && this.userInput) {
					for (let i = 0; i < 4; i++) {
						this.suggestedTickers.push(item);
					}
					break;
				}
			}
		},

		reset() {
			//сброс выбраного тикера
			clearInterval(this.stripeInterval);
			this.currentTicker = null;
		},

		updateRenderetTickers() {
			//обновление загружанных тикеров
			setInterval(() => {
				this.tickers.forEach(ticker => {
					requestTickets(ticker.name).
						then(data => ticker.price = data.USD);
				})
			}, 3000);
		},

		saveTickersLocal(action) {
			//сохранение даннх в localStorage
			const localcontext = this;
			const settings = {

				'set': function () {
					localStorage.setItem('localTickers', JSON.stringify(localcontext.tickers));
				},

				'get': function () {
					if (localStorage.getItem('localTickers')) {
						localcontext.tickers = JSON.parse(localStorage.getItem('localTickers'))
					}
				}
			}
			settings[action]();
		},
		
		paginationPrev() {
			//Пагинация назад
			this.page--;
		},

		paginationNext() {
			//Пагинация вперед	
			this.page++;
		},

		urlLoad(){
			// загрузка параметров url по умолчанию
			const params  = new URLSearchParams(window.location.search);
			if(parseInt (params.get('page'))){
				
				this.page = parseInt (params.get('page'));
			}
			this.searchValue = params.get('filter');
		},

		urlFiltering(){
			//филтрация по URL адресса
			const url = new URL(window.location.href);
			const params = new URLSearchParams(url.search);
			params.set('page' , this.page);	
			params.set('filter' , this.searchValue);
			url.search = params;
			window.history.pushState({} , `${document.title} = page = ${this.page}` , url);
		}

	},
	
	created: function () {
		getAllTickersName(this);
		this.updateRenderetTickers();
		this.saveTickersLocal('get');
		this.urlLoad();
	},

	computed: {
		filteredTickers() {
			//филтрация тикеров
			let tickers = [];
			
			if (this.tickers.length) {
				tickers = this.tickers;
			}

			if(this.searchValue){
				//при ввыода текста в поля поиска
				tickers = this.tickers.filter(item => item.name.startsWith(this.searchValue.toUpperCase()));
			}

			return tickers.slice((this.page - 1) * this.paginationCount, this.page * this.paginationCount);
		},

		hasNextPage() {
			//проверка следушего стриницу 
			let isNext = false;

			if (this.tickers.length / this.paginationCount > this.page) {
				isNext = true;
			}
			if (this.searchValue) {
				isNext = false;
			}
			return isNext;
		}
	},
	watch:{

		filteredTickers(){
			this.saveTickersLocal('set');
			
			if(this.filteredTickers.length === 0 && this.page > 1){
				this.paginationPrev();
			}
		},

		searchValue(){
			this.currentTicker = null;
			if(!this.searchValue){
				this.searchValue = '';
			}
			this.urlFiltering();
		},

		page(){
			this.currentTicker = null;
			this.urlFiltering();
		}
	}
}
</script>