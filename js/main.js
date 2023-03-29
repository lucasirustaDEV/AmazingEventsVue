const { createApp } = Vue

const app = createApp({
    data(){
        return {
            API_URL_EVENTS: "https://mindhub-xj03.onrender.com/api/amazing",
            events: [],
            currentDate: '',
            categories: [],
            searchText: '',
            checkCategories: [],
            eventsFilter: [],
            logo: './assets/LogoAmazingEvents.png',
            activePage: '',
            eventDetails: [],
            
            dataEvents: [],

            contador: 0,

        }
    },
    created(){
        console.log('app creada');
        this.getEvents();
       
    },
    mounted(){

    },
    methods:{
        async getEvents() {
            try {
                const response = await fetch(this.API_URL_EVENTS);
                const dataEvents = await response.json();

                this.currentDate = dataEvents.currentDate;

                this.loadPage();
                console.log(this.activePage);

                if (this.activePage == "PAST EVENTS"){
                    this.events = dataEvents.events.filter(event => event.date < this.currentDate);
                    this.dataEvents = this.events;
                } else if (this.activePage == "UPCOMING EVENTS"){
                    console.log('paso por el upcoming');
                    this.events = dataEvents.events.filter(event => event.date > this.currentDate);
                    this.dataEvents = this.events;
                }else {
                    console.log('paso por el home');
                    this.events = dataEvents.events;
                    this.dataEvents = this.events;
                }
                console.log(this.dataEvents);
                
                this.getCategories();

            }catch (error) {
              console.log(error.message);
            }
        },

        getCategories() {
            let categorias = [];
            this.events.forEach(event => {
                if (!categorias.includes(event.category)){ 
                    categorias.push(event.category);
                }
            });
            this.categories = categorias.sort();
        },

        filterText(array, text) {
            let arrayFiltrado = array.filter(event => event.name.toLowerCase().includes(text.toLowerCase()));
            return arrayFiltrado;
        },
        
        filterCategory(array) {
            if (this.checkCategories.length === 0){
                return array;
            }else {
                let arrayFiltrado = array.filter(event => this.checkCategories.includes(event.category));
                return arrayFiltrado;
            }
        
        },
        
        loadPage(){
            this.activePage = document.getElementById("page").innerText;
        },


    },
    computed:{
        crossFilter() {
            this.eventsFilter = this.filterCategory(this.dataEvents);
            this.eventsFilter = this.eventsFilter.filter(event => event.name.toLowerCase().includes(this.searchText.toLowerCase()));
            this.events = this.eventsFilter;
        },

        loadDetails() {
            let queryString = location.search;
            let params = new URLSearchParams(queryString);
            let eventId = params.get('eventId');
            console.log("load details");
            this.eventDetails = this.events.filter(event => event._id == eventId);
        },

    }
}).mount('#app')