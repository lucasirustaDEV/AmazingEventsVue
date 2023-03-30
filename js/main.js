const { createApp } = Vue

const app = createApp({
    data(){
        return {
            API_URL_EVENTS: "https://mindhub-xj03.onrender.com/api/amazing",
            logo: './assets/LogoAmazingEvents.png',

            activePage: '',
            loading: true,
            
            dataEvents: [],
            events: [],
            currentDate: '',
            categories: [],
            
            searchText: '',
            checkCategories: [],
            eventsFilter: [],

            eventDetails: [],          

            name: "",
            email: "",
            message: "",
            formErrors: [],

            eventStat01: [],
            eventStat02: [],
            eventStat03: [],

            upStats: [],
            pastStats: [],

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

                if (this.activePage == "STATS"){
                    this.eventsStats();
                }

                this.loading = false;

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

        /////////////////////////////////CONTACT///////////////////////////////////
        sendMessage(event) {
            
            if(!this.name){
                alert("Please enter a name");
                document.getElementById("name").focus();
            }else if(!this.email) {
                alert("Please enter a email address");
                document.getElementById("email").focus();
            }else if(!this.message) {
                alert("Please enter a message");
                document.getElementById("message").focus();
            }else {
                const myFormData = new FormData(event.target);
                const formDataObj = Object.fromEntries(myFormData.entries());
                console.log(formDataObj);
                const JSONData = JSON.stringify(formDataObj);
                console.log(JSONData);
                alert("Message sent successfully");
                document.getElementById("form").reset();
            }
            event.preventDefault();
        },

        ////////////////////////////////STATISTICS////////////////////////////////
        getEventsByCategory(category, events) {
            return events.filter(event => event.category.includes(category));
        },
        
        getUpAttendanceByCategory(eventsByCategory){
            let attandeance = 0;
            eventsByCategory.forEach(event => { 
                attandeance += (event.estimate / event.capacity) * 100;
            });
            attandeance = (attandeance/eventsByCategory.length).toFixed(2);
            return attandeance;
        },
        
        getUpRevenuesByCategory(eventsByCategory){
            let revenues = 0;
            eventsByCategory.forEach(event => { 
                revenues += (event.estimate * event.price);
            });
            revenues = Math.trunc(revenues);
            return revenues;
        },

        getAttendanceByCategory(eventsByCategory){
            let attandeance = 0;
            eventsByCategory.forEach(event => { 
                attandeance += (event.assistance / event.capacity) * 100;
            });
            attandeance = (attandeance/eventsByCategory.length).toFixed(2);
            return attandeance;
        },
        
        getPastRevenuesByCategory(eventsByCategory){
            let revenues = 0;
            eventsByCategory.forEach(event => { 
                revenues += (event.assistance * event.price);
            });
            revenues = Math.trunc(revenues);
            return revenues;
        },

        eventWithLargerCapacity(){
            this.events.sort((a, b) => b.capacity - a.capacity);
            //return events[0];
            this.eventStat03 = this.events[0];
        },
        
        eventWithHPofAtt() {
            const eventoMayorAsistencia = this.events.reduce((eventoMayor, eventoActual) => {
                const porcentajeActual = (eventoActual.assistance / eventoActual.capacity) * 100;
                const porcentajeMayor = (eventoMayor.assistance / eventoMayor.capacity) * 100;
                
                if (porcentajeActual > porcentajeMayor) {
                    return eventoActual;
                } else {
                    return eventoMayor;
                }
            });
            //return eventoMayorAsistencia;
            this.eventStat01 = eventoMayorAsistencia;
        },
        
        eventWithLPofAtt() {
            const eventoMenorAsistencia = this.events.reduce((eventoMenor, eventoActual) => {
                const porcentajeActual = (eventoActual.assistance / eventoActual.capacity) * 100;
                const porcentajeMenor = (eventoMenor.assistance / eventoMenor.capacity) * 100;
                
                if (porcentajeActual < porcentajeMenor) {
                    return eventoActual;
                } else {
                    return eventoMenor;
                }
            });
            //return eventoMenorAsistencia;
            this.eventStat02 = eventoMenorAsistencia;
        },

        eventsStats() {
            this.eventWithHPofAtt(); 
            this.eventWithLPofAtt(); 
            this.eventWithLargerCapacity();
        },
        

    },
    computed:{
        crossFilter() {
            if (this.checkCategories.length === 0){
                this.eventsFilter = this.dataEvents;
            }else {
                this.eventsFilter = this.dataEvents.filter(event => this.checkCategories.includes(event.category));
            }
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

        upCategoriesStats() {
            let upEvents = this.events.filter(event => event.date > this.currentDate);
            this.categories.forEach(category => {
                let eventsByCategory = this.getEventsByCategory(category, upEvents);
                if (eventsByCategory.length != 0) {
                    let upRevenuesByCategory = this.getUpRevenuesByCategory(eventsByCategory);
                    let attendanceByCategory = this.getUpAttendanceByCategory(eventsByCategory);
                    this.upStats.push({category: category, rev: upRevenuesByCategory, att: attendanceByCategory});
                }
            })
        },

        pastCategoriesStats() {
            let pastEvents = this.events.filter(event => event.date < this.currentDate);
            this.categories.forEach(category => {
                let eventsByCategory = this.getEventsByCategory(category, pastEvents);
                if (eventsByCategory.length != 0) {
                    let pastRevenuesByCategory = this.getPastRevenuesByCategory(eventsByCategory);
                    let attendanceByCategory = this.getAttendanceByCategory(eventsByCategory);
                    this.pastStats.push({category: category, rev: pastRevenuesByCategory, att: attendanceByCategory});
                }
            })
        },

    }
}).mount('#app')