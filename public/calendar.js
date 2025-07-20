document.addEventListener('DOMContentLoaded', function() {
  // Initialize FullCalendar for menstrual cycle tracking
  initializeMenstrualCalendar();
  
  // Initialize FullCalendar for ovulation tracking
  initializeOvulationCalendar();
  
  // Initialize pregnancy milestone calendar
  initializePregnancyCalendar();
  
  // Initialize menopause tracking calendar
  initializeMenopauseCalendar();
});

function initializeMenstrualCalendar() {
  const calendarEl = document.getElementById('menstrual-cycle-calendar');
  if (!calendarEl) return;
  
  // Sample period data - in a real app this would come from the backend
  const periodData = [
    {
      title: 'Period',
      start: '2023-07-05',
      end: '2023-07-10',
      color: '#8e7cc3'
    },
    {
      title: 'Period',
      start: '2023-08-02',
      end: '2023-08-07',
      color: '#8e7cc3'
    }
  ];
  
  // Sample ovulation data
  const ovulationData = [
    {
      title: 'Ovulation',
      start: '2023-07-19',
      allDay: true,
      color: '#f0a28b'
    },
    {
      title: 'Ovulation',
      start: '2023-08-16',
      allDay: true,
      color: '#f0a28b'
    }
  ];
  
  // Sample fertile window data
  const fertileWindowData = [
    {
      title: 'Fertile Window',
      start: '2023-07-16',
      end: '2023-07-22',
      color: '#6aa7c8',
      textColor: 'white'
    },
    {
      title: 'Fertile Window',
      start: '2023-08-13',
      end: '2023-08-19',
      color: '#6aa7c8',
      textColor: 'white'
    }
  ];
  
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    },
    events: [...periodData, ...ovulationData, ...fertileWindowData],
    eventDidMount: function(info) {
      // Add tooltips to events
      const tooltip = new bootstrap.Tooltip(info.el, {
        title: info.event.title,
        placement: 'top',
        trigger: 'hover',
        container: 'body'
      });
    },
    dateClick: function(info) {
      showDayModal(info.dateStr);
    }
  });
  
  calendar.render();
  
  // Function to show modal for adding period/symptom data
  function showDayModal(date) {
    const formattedDate = new Date(date).toLocaleDateString();
    const modal = new bootstrap.Modal(document.getElementById('day-detail-modal'));
    
    document.getElementById('selected-date').textContent = formattedDate;
    document.getElementById('day-date-input').value = date;
    
    modal.show();
  }
}

function initializeOvulationCalendar() {
  const calendarEl = document.getElementById('ovulation-fertility-calendar');
  if (!calendarEl) return;
  
  // Sample fertility data
  const fertilityData = [
    {
      title: 'High Fertility',
      start: '2023-07-16',
      end: '2023-07-22',
      color: '#6aa7c8'
    },
    {
      title: 'Peak Fertility',
      start: '2023-07-19',
      end: '2023-07-20',
      color: '#f0a28b'
    },
    {
      title: 'BBT Rise',
      start: '2023-07-20',
      allDay: true,
      color: '#7EBDC2'
    }
  ];
  
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    },
    events: fertilityData,
    eventDidMount: function(info) {
      // Add tooltips to events
      const tooltip = new bootstrap.Tooltip(info.el, {
        title: info.event.title,
        placement: 'top',
        trigger: 'hover',
        container: 'body'
      });
    }
  });
  
  calendar.render();
}

function initializePregnancyCalendar() {
  const calendarEl = document.getElementById('pregnancy-milestone-calendar');
  if (!calendarEl) return;
  
  // Calculate pregnancy milestones based on due date
  const dueDate = document.getElementById('due-date-input')?.value || '2023-12-31';
  const dueDateObj = new Date(dueDate);
  
  // Calculate 40 weeks back for conception date (approximate)
  const conceptionDate = new Date(dueDateObj);
  conceptionDate.setDate(conceptionDate.getDate() - 280);
  
  // Generate milestone events
  const milestones = [];
  
  // First trimester milestones
  for (let week = 4; week <= 13; week += 2) {
    const milestoneDate = new Date(conceptionDate);
    milestoneDate.setDate(milestoneDate.getDate() + (week * 7));
    
    milestones.push({
      title: `Week ${week}`,
      start: milestoneDate.toISOString().split('T')[0],
      allDay: true,
      color: '#8e7cc3'
    });
  }
  
  // Second trimester milestones
  for (let week = 16; week <= 26; week += 2) {
    const milestoneDate = new Date(conceptionDate);
    milestoneDate.setDate(milestoneDate.getDate() + (week * 7));
    
    milestones.push({
      title: `Week ${week}`,
      start: milestoneDate.toISOString().split('T')[0],
      allDay: true,
      color: '#6aa7c8'
    });
  }
  
  // Third trimester milestones
  for (let week = 28; week <= 40; week += 2) {
    const milestoneDate = new Date(conceptionDate);
    milestoneDate.setDate(milestoneDate.getDate() + (week * 7));
    
    milestones.push({
      title: `Week ${week}`,
      start: milestoneDate.toISOString().split('T')[0],
      allDay: true,
      color: '#f0a28b'
    });
  }
  
  // Add the due date
  milestones.push({
    title: 'Due Date!',
    start: dueDate,
    allDay: true,
    color: '#ff0000'
  });
  
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    initialDate: dueDateObj,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    },
    events: milestones
  });
  
  calendar.render();
  
  // Update calendar when due date changes
  document.getElementById('due-date-input')?.addEventListener('change', function() {
    document.getElementById('update-due-date-btn')?.click();
  });
}

function initializeMenopauseCalendar() {
  const calendarEl = document.getElementById('menopause-symptom-calendar');
  if (!calendarEl) return;
  
  // Sample symptom data
  const symptomData = [
    {
      title: 'Hot Flashes (7)',
      start: '2023-07-02',
      allDay: true,
      color: '#f0a28b'
    },
    {
      title: 'Mood Swings',
      start: '2023-07-03',
      allDay: true,
      color: '#8e7cc3'
    },
    {
      title: 'Insomnia',
      start: '2023-07-05',
      allDay: true,
      color: '#6aa7c8'
    },
    {
      title: 'Hot Flashes (3)',
      start: '2023-07-07',
      allDay: true,
      color: '#f0a28b'
    }
  ];
  
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    },
    events: symptomData,
    dateClick: function(info) {
      showSymptomModal(info.dateStr);
    }
  });
  
  calendar.render();
  
  // Function to show modal for adding symptom data
  function showSymptomModal(date) {
    const formattedDate = new Date(date).toLocaleDateString();
    const modal = new bootstrap.Modal(document.getElementById('symptom-modal'));
    
    document.getElementById('symptom-date').textContent = formattedDate;
    document.getElementById('symptom-date-input').value = date;
    
    modal.show();
  }
}
