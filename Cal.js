let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')): [];

const calendar = document.getElementById('calendar');
const neweventmodal = document.getElementById('newEventModal');
const deleteeventmodal = document.getElementById('deleteeventmodal');
const backdrop = document.getElementById('modalBackDrop');
const eventtitleinput = document.getElementById('eventTitleInput')
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function openmodal (date) {
    clicked = date;

    const eventforday = events.find(e => e.date === clicked);

    if(eventforday){
        document.getElementById('eventtext').innerText = eventforday.title;
        deleteeventmodal.style.display = 'block';

    } else{
        neweventmodal.style.display = 'block';
    }
    backdrop.style.display = 'block';
}

function load(){
    const dt = new Date();

    if(nav !== 0){
        dt.setMonth(new Date().getMonth() + nav);
    }

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    const firstdayofmonth = new Date(year, month, 1);
    const daysinmonth = new Date(year, month + 1, 0).getDate();
    
    const datestring = firstdayofmonth.toLocaleDateString('en-us',{
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    
    });

    const paddingdays = weekdays.indexOf(datestring.split(', ')[0]);

    document.getElementById('monthdisplay').innerText = `${dt.toLocaleDateString('en-us', { month:'long' })} ${year}`;

    calendar.innerHTML = '';

    for(let i = 1; i <= paddingdays + daysinmonth; i++){
        const daysquare = document.createElement('div');
        daysquare.classList.add('day');

        const daystring = `${month + 1}/${i - paddingdays}/${year}`;

        if(i > paddingdays){
            daysquare.innerText = i - paddingdays;

            const eventforday = events.find(e => e.date === daystring);

            if(i - paddingdays === day && nav === 0){
                daysquare.id = 'currentday';
            }

            if(eventforday){
                const eventdiv = document.createElement('div');
                eventdiv.classList.add('event');
                eventdiv.innerText = eventforday.title;
                daysquare.appendChild(eventdiv);
            } else{

            }

            daysquare.addEventListener('click', () => openmodal(daystring));
        }  else{
            daysquare.classList.add('padding');
        }
        calendar.appendChild(daysquare);
    }
}

function closemodal(){
    eventtitleinput.classList.remove('error');
    neweventmodal.style.display = 'none';
    deleteeventmodal.style.display = 'none';
    backdrop.style.display = 'none';
    eventtitleinput.value = '';
    clicked = null;
    load();
}

function saveevent(){
    if(eventtitleinput.value){
        eventtitleinput.classList.remove('error'); 
        
        events.push({
            date: clicked,
            title: eventtitleinput.value,
        });

        localStorage.setItem('events', JSON.stringify(events));
        closemodal();
    } else{
        eventtitleinput.classList.add('error');        
    }
}

function deleteevent(){
    events = events.filter(e => e.date !== clicked);
    localStorage.setItem('events', JSON.stringify(events));
    closemodal();
}

function initButtons(){
    document.getElementById('nextbtn').addEventListener('click', () => {
        nav++;
        load();
    });
    document.getElementById('backbtn').addEventListener('click', () => {
        nav--;
        load();
    });
    document.getElementById('savebtn').addEventListener('click', saveevent);
    document.getElementById('cancelbtn').addEventListener('click', closemodal);

    document.getElementById('deletebtn').addEventListener('click', deleteevent);
    document.getElementById('closebtn').addEventListener('click', closemodal);

}

initButtons();

load();
