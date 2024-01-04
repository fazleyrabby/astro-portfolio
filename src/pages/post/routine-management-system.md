---
layout: ../../layouts/BlogLayout.astro
thumbnail: https://i.postimg.cc/brfpk46T/markus-winkler-hx-CIfi47-Fg-Q-unsplash-2.jpg
title: Routine Management System
date: 2022-02-25T12:00:00.000Z
---
### Project Overview

This project was created using Laravel 7 and mysql on my last semester as my final year project. The database design was completely done my me as my first laravel project I tried my best to make it as optimize as possible. Most of the complicated DB queries created with raw query as I was not much familiar with eloquent relationships at the beginning but recently I have worked with a team and improved my coding structure as well as eloquent relationship knowledge. This project was appreciated by my university faculty as it's almost a new concept of migrating a manual routine system to an automated one. As I can say this was not completed entriely because I was working alone in this project but I can surely say that I have gained alot of real world experience.

<cite>(I am working on this project currently to modify unoptimized codes and Integrating AdminLTE 3)</cite>

### The scope for works include the followings:

<ul>
<li>System study of the manual system practiced for class routine management.</li>
<li>Design and Development a dynamic web application for faculty.</li>
<li>Implementation of Class Routine Management System.</li>
<li>Maintenance of the Class Routine Management System.</li>
</ul>

<br>

<h2 class="text-center">Some Screenshots</h2>

### Teachers

<img src="https://user-images.githubusercontent.com/26044286/118698795-a3263d80-b832-11eb-91b3-6989a31ff063.png" alt="" width="100%"/>

### Teacher Update

<img src="https://user-images.githubusercontent.com/26044286/118699254-221b7600-b833-11eb-9c52-86239f863a9f.png" alt="" width="100%"/>

### Batch Wise Student

<img src="https://user-images.githubusercontent.com/26044286/118699326-36f80980-b833-11eb-826f-03087c64ba15.png" alt="" width="100%"/>

### Time Slot

<img src="https://user-images.githubusercontent.com/26044286/118699334-38c1cd00-b833-11eb-8eaf-edc33e0beede.png" alt="" width="100%"/>

### Courses

<img src="https://user-images.githubusercontent.com/26044286/118699339-39f2fa00-b833-11eb-97ff-dd1f9fcb8525.png" alt="" width="100%"/>

### Time Wise Class Slots

<img src="https://user-images.githubusercontent.com/26044286/118699347-3cedea80-b833-11eb-8a85-75f27a195c7b.png" alt="" width="100%"/>

### Teacher / Batch wise routine list

<img src="https://user-images.githubusercontent.com/26044286/118699383-47a87f80-b833-11eb-9270-c2b77e254115.png" alt="" width="100%"/>

### Batch Routine PDF

<img src="https://user-images.githubusercontent.com/26044286/118699387-49724300-b833-11eb-94f7-067a2237686f.png" alt="" width="100%"/>

### Batch Routine View

<img src="https://user-images.githubusercontent.com/26044286/118699390-4a0ad980-b833-11eb-9b9f-762c836437f9.png" alt="" width="100%"/>

### Teacher Routine PDF

<img src="https://user-images.githubusercontent.com/26044286/118699394-4b3c0680-b833-11eb-8645-e28171811535.png" alt="" width="100%"/>

### Teacher Routine View

<img src="https://user-images.githubusercontent.com/26044286/118699396-4bd49d00-b833-11eb-8412-41064e4362f4.png" alt="" width="100%"/>

### Main Routine Sheet

<img src="https://user-images.githubusercontent.com/26044286/118699397-4c6d3380-b833-11eb-80cb-79d7ec49edf4.png" alt="" width="100%"/>

### Day WIse Time Slot with Class Slot Count

<img src="https://user-images.githubusercontent.com/26044286/118699400-4d05ca00-b833-11eb-8c7f-e0023804417e.png" alt="" width="100%"/>

### Modules:

| **SL** | **Module Title** | **Description** |
| --- | --- | --- |
| 1 | Batch | <ol><li>Create Batch with Department, Batch No. and Shift</li><li>Edit / Delete Batch </li></ol>|
| 2 | Departments | <ol><li> Create Departments (example: CSE, MBA etc.) </li><li>  Edit / Delete Departments </li> </ol> |
| 3 | Courses | <ol><li>Create Courses with Course Code, Credit and Course type (example: Data Communication-CSE435-3-Theory etc.) </li> <li>Edit / Delete Courses</li> <ol>|
| 4 | Rooms | <ol> <li>Create Rooms with Building, Room no, Capacity (example: A-101-Theory, B-203-Lab etc.)</li> <li>Edit / Delete Rooms</li> </ol> |
| 5 | Sections | <ol><li>Create different sections and their sub sections including their type (example: A-Theory, A1-Lab)</li> <li>Edit / Delete Sections</li> </ol>  |
| 6 | Sessions &amp; Yearly Sessions | <ol><li>Create Sessions (example: Fall, Summer, Spring) </li><li>Edit / Delete Sessions3. Generate Yearly Sessions every year which includes sessions (example: Fall-2020, Summer-2020, Spring-2020)</li><li>Activate or Deactivate yearly sessions</li></ol> |
| 7 | Teacher Ranks | <ol><li> Create Teacher Ranks (example: Lecturer, Sr. Lecturer)</li><li>Edit / Delete Teacher Ranks</li></ol> |
| 8 | Teacher Management | <ol><li> Add New Teacher with their corresponding information which includes role, rank and photo etc. </li><li>Edit / Delete Teacher Data</li><li>Assign teachers off day</li><li>Assigning teachers in routine committee</li><li>Inviting Teachers with expire time of accessing the main sheet</li><li>Revoke access of main sheet</li></ol> |
| 9 | Teacher Workloads |  <ol><li>Assign courses to teachers including the yearly session</li><li>Edit / Delete Workload Data </li> </ol> |
| 10 | Student Management Batch &amp; Section Wise |  <ol><li>Assign number of students in a batch including the yearly session and shifts</li><li>Assign number of students theory and lab wise </li><li>Edit / Delete Assigned Data </li> </ol> |
| 11 | Time Slot Management | <ol><li>Create Time Slots by Start time and end time</li><li>Edit / Delete time slots</li></ol> |
| 12 | Course Offers | <ol><li>Assign Courses to Batch with sessions</li><li>Edit / Delete Course offers data</li></ol> |
| 13 | Day wise time &amp; Class slot management | <ol><li>Assign Time Slots to Days</li><li>Assign Class Slots to Day and time slot</li><li>Edit Information of day</li></ol>|
| 14 | Assign Data in Main Sheet |<ol><li>Assign data (Teacher, Course, Room) in main sheet</li><li>Edit Assigned Data</li></ol>|
| 15 | Routine View &amp; Download | <ol><li>List view for batch and teachers</li><li>Search Teacher and batch view</li><li>Download as PDF</li></ol>

### Installation 
After cloning this repo create an .env file and copy everything from .env.example<br>
<pre> cp .env.example .env </pre>
It will create a copy of .env.example as .env <br><br>
Now open the .env file you just created and give a database name on DB_DATABASE as you want<br>
Suppose the database name is routine<br>
The database configuration will look like this<br>
<pre>DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=routine
DB_USERNAME=root
DB_PASSWORD=</pre>
After that create a database named as "routine" which I used as an example above <br><br>
Now install all composer packages <br>
<pre> composer install </pre>
Now generate an APP_KEY <br>
<pre> php artisan key:generate </pre>
Then run migration as well as db:seed command to get some pre-existing data to get started with the project<br>
<pre> php artisan migrate:fresh --seed </pre>
Now you can serve the project or run with xampp anyway you prefer<br><br>
To serve with artisan <br>
<pre> php artisan serve </pre>
Now you can run the project with localserver accessing this url below:
<pre> http://127.0.0.1:8000 </pre> 

**Admin** Credentaials:
<table>
<tbody>
<tr>
<td>Username</td>
<td>superadmin</td>
</tr>
<tr>
<td>Password</td>
<td>123456</td>
</tr>
</tbody>
</table>

**Teacher/User** Credentaials:
<table>
<tbody>
<tr>
<td>Username</td>
<td>maqsudur_rahman</td>
</tr>
<tr>
<td>Password</td>
<td>123456</td>
</tr>
</tbody>
</table>