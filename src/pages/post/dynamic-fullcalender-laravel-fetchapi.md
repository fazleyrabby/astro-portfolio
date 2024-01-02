---
layout: ../../layouts/BlogLayout.astro
title: Dynamic Fullcalender with Laravel & FetchAPI
date: 2022-02-25T12:00:00.000Z
slug: test
---

## This is applicable on existing or a fresh laravel project

<p>
First of all let's add the required cdn or links to your page. as showed below. And I also added some boilerplate codes from the documentation of fullcalender.io
</p>



    <!DOCTYPE html>
    <html lang='en'>
    <head>
        <meta charset='utf-8' />
            <link href='https://cdn.jsdelivr.net/npm/fullcalendar@5.7.0/main.css' rel='stylesheet'/> 
        <script src='https://cdn.jsdelivr.net/npm/fullcalendar@5.7.0/main.min.js'></script> 
        <script>

        document.addEventListener('DOMContentLoaded', function() {
            var calendarEl = document.getElementById('calendar');
            var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth'
            });
            calendar.render();
        });

        </script>
    </head>
    <body>
        <div id='calendar'></div>
    </body>
    </html>

<p>
This will render an empty calender
</p>

To fetch some data from database and handle the click events lets create a controller name **CalenderControler** and create the methods to handle data as well

    class CalenderController extends Controller
    {
        // To show calender index file
        public function index(){
            return view('index');
        }

        // To fetch title and date from database
        public function fetch(){
            $events = Event::select('title','start')->get();
            return response()->json($events);
        }

        // To create new event
        public function create(Request $request){
            $event = new Event();
            $event->title = $request->title;
            $event->start = $request->eventDate;
            $event->save();
        }

    }

Lets declare some routes as well before starting with the script 

    //show the calender
    Route::get('/calender', [CalenderController::class,'index']);

    //fetch calender data
    Route::get('/fetchCalenderEvents', [CalenderController::class,'fetch']);

    //create new calender data
    Route::post('/create', [CalenderController::class,'create']);


Now lets modify our index page to fetch some data from database and render on the calender

    ...initialView: 'dayGridMonth',
    eventSources: [
        {
        url: '/fetchCalenderEvents',
        }
    ],

After initial view option add this new property called eventSources with an option of url which has the url of your **fetch()** method inside **CalenderController** it will fetch your data and render them on the calender. 

Now Lets handle the click event on each date:
After **eventSources** add **select** function as a property of fullcalender  

        ...select: function(startDate) {
        let eventDate = startDate.startStr
        // Take event data from a prompt alert
        let title = prompt('Add new event!')
        if(title === null || title == ''){
            // Stop the function if value is null
            return;
        }
        fetch('/create', {
            method: 'post',
            body: JSON.stringify({title, eventDate}),
            headers: {
            'Content-Type' : 'application/json',
            'X-CSRF-TOKEN' : csrfToken
            },
        })
        .then(e => {
                // refresh and render
                calendar.refetchEvents();
            })
        }

**Click on any day to assign an event to the corresponding date**

Full script: [https://codepen.io/fazley_rabby/pen/WNXYPrr](https://codepen.io/fazley_rabby/pen/WNXYPrr)
   
For video tutorial check this out: 
[![IMAGE_ALT](https://img.youtube.com/vi/p5LOeVsGLSA/0.jpg)](https://www.youtube.com/watch?v=p5LOeVsGLSA&t)

Click here to check the Fullcalender documentation [Fullcalender.io](https://fullcalendar.io/docs/initialize-globals)