const { createApp } = Vue

const app = createApp({
    data(){
        return {
            API_URL_EVENTS: "https://mindhub-xj03.onrender.com/api/amazing",
            events: [],
            currentDate: "",
            categories: [],
            //tagCards: document.getElementById("card-js"),
            //tagCheckboxs: document.getElementById("category-js"),
            //search: document.getElementById('search'),
            //mensaje: 'Hola desde VUE!',
            //nombre: 'Eduardo',
            //edad: 33,
            //contador: 0,
            //texto: '',
            //foto: 'gato',
            //frutas: ['melon','pera','sandia',null,'tomate',null],
            //fruta: '',
        }
    },
    created(){
        console.log('app creada');
        this.getEvents();
        //console.log(this.mensaje);
        //let h1 = document.querySelector('h1')
        //console.log(h1);
    },
    mounted(){

        this.getCategories(this.events);
        
        //loadCategories(dataEvents.events);

        //search.addEventListener('input', crossFilter) 
        //tagCheckboxs.addEventListener('change', crossFilter);
    
        //crossFilter();

        //console.log('app montada');
        //console.log(this.mensaje);
        //let h1 = document.querySelector('h1')
        //console.log(h1);
    },
    methods:{
        async getEvents() {
            try {
              const response = await fetch(this.API_URL_EVENTS);
              const dataEvents = await response.json();

              this.events = dataEvents.events;
              this.currentDate = dataEvents.currentDate;
              
              this.getCategories(this.events);

            }catch (error) {
              console.log(error.message);
            }
          },

        getCategories(events) {
            let categorias = [];
            events.forEach(event => {
                if (!categorias.includes(event.category)){ 
                    categorias.push(event.category);
                }
            });
            //return categories.sort();
            this.categories = categorias.sort();
            console.log(this.categories);
        },

        contar(){
            this.contador++
            console.log("cuenta" + this.contador)
        },
        agregarElemento(){
            this.frutas.push(this.fruta)
            this.fruta = ''
        }
    },
    computed:{

        //miEdadyMiNombre(){
            //return `Hola, me llamo ${this.nombre} y tengo ${this.edad} años.`
        //}
    }
}).mount('#app')