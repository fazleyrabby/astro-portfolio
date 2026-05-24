---
title: "Routine Management System"
type: "Internal Tool"
featured: false
problem: "University scheduling was handled manually with no system to detect conflicts at scale."
solution: "Routine management system for PCIU built with Laravel and MySQL, enabling conflict-free schedule creation."
live: "https://routine-pciu.rhtech.dev/"
github: "https://github.com/fazleyrabby/routine-lte"
thumbnail: "/projects/4.webp"
description: "University routine management system for conflict-free scheduling."
tech: ["PHP", "Laravel 8", "jQuery", "MySQL"]
position: 9
period: "2020 – 2024"
role: "Final Year Project — Solo"
highlights:
  - "Replaced a fully manual scheduling process by digitising what was previously managed with spreadsheets and paper — recognised by university faculty as a novel automation."
  - "Solved multi-constraint scheduling complexity by modelling 15 interconnected entities (batches, departments, courses, rooms, sections, teachers, time slots, sessions) with raw SQL queries before migrating to Eloquent."
  - "Eliminated scheduling conflicts with a main routine sheet assigning teacher + course + room per time slot with conflict visibility — preventing double-booking across batches."
  - "Reduced admin overhead with teacher invite/revoke (expiring tokens), off-day assignment, workload tracking, and batch/section-wise student counts."
  - "Delivered shareable batch-wise and teacher-wise PDF routines — replacing manual printout preparation."
scope:
  - "15 CRUD modules: Batches, Departments, Courses, Rooms, Sections, Sessions & Yearly Sessions, Teacher Ranks, Teachers, Teacher Workloads, Student Management, Time Slots, Course Offers, Day-wise Class Slots, Main Sheet Assignment, Routine View & Download."
  - "Teacher management: role/rank/photo, off days, routine committee assignment, invite with expiring tokens, revoke access."
  - "Teacher workload assignment per yearly session."
  - "Student management: batch/section-wise counts, theory/lab splits."
  - "Time slot management with class slot counts per day."
  - "Main routine sheet: teacher + course + room per slot, edit assignments."
  - "Routine view and PDF download: batch-wise and teacher-wise with search."
  - "Migrated Laravel 7 → 8, integrated AdminLTE 3, added database seeders."
  - "GitHub Actions CI/CD deploy workflow."
---
