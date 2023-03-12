<template>
	<div id="add-ticker">

		<section>
			<div class="flex">
				<div class="max-w-xs">
					<label for="wallet" class="block text-sm font-medium text-gray-700">Тикер</label>
					<div class="mt-1 relative rounded-md shadow-md">
						<input v-model="userInput" @keydown.enter="addTicker(userInput)" @input="onInput" type="text"
							name="wallet" id="wallet"
							class="block w-full pr-10 border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md p-2 mb-1"
							placeholder="Например DOGE" />
					</div>
					<div v-if="suggestedTickers.length"
						class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap p-2">
						<span v-for="(suggest, id) of suggestedTickers" :key="id" @click="addTicker(suggest)"
							class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
							{{ suggest }}
						</span>
					</div>
					<div v-if="message" class="text-sm text-red-600">{{ message }}</div>
				</div>
			</div>
			<button @click="addTicker(userInput)" type="button"
				class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
				<!-- Heroicon name: solid/mail -->
				<svg class="-ml-0.5 mr-2 h-6 w-6" xmlns="http://www.w3.org/2000/svg" width="30" height="30"
					viewBox="0 0 24 24" fill="#ffffff">
					<path
						d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z">
					</path>
				</svg>
				Добавить
			</button>
		</section>
	</div>
</template>

<script>
import { getAllTickersName } from '@/api';
export default {
	data() {
		return {
			userInput: '',
			allTickersName: [],
			suggestedTickers: [],
		}
	},
	methods: {

		addTicker(ticker) {
			//добавление тикеров

			if (ticker) {
				this.$emit('add-ticker', ticker);
			} else {
				this.$emit('add-ticker', this.userInput);
			}
			this.suggestedTickers = '';
			this.userInput = '';
			console.log(this.message);
		},

		onInput() {
			//обработчик поля ввыода для добавленя тикера
			this.suggestedTickers = [];
			for (let item in this.allTickersName) {
				if (item.startsWith(this.userInput.toUpperCase()) && this.userInput) {
					for (let i = 0; i < 4; i++) {
						this.suggestedTickers.push(item);
					}
					break;
				}
			}
			this.$emit('input-ticker');
		},

	},
	created() {
		getAllTickersName(this);
	},
	props:{
		message:String,
	} ,
}

</script>