/* MUSAF 2026 - FCM web push service worker, placed at site root. */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');
firebase.initializeApp({
  apiKey:'AIzaSyCBw2g-XqUt_M-SrmklkNUGbHv1I8L1Qas',
  authDomain:'musaf-ldks-fsh-2026.firebaseapp.com',
  projectId:'musaf-ldks-fsh-2026',
  messagingSenderId:'243520667568',
  appId:'1:243520667568:web:e3586cc7867031d1aea075'
});
const messaging=firebase.messaging();
messaging.onBackgroundMessage(payload=>{
  const d=payload.data||{};
  self.registration.showNotification(d.title||'Pengingat Deadline MUSAF',{
    body:d.body||'Ada tugas MUSAF yang perlu diperiksa.',
    icon:'/favicon.ico',
    tag:d.tag||'musaf-deadline',
    data:{url:d.url||'/'}
  });
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const url=new URL(event.notification.data?.url||'/',self.location.origin);
  if(url.origin!==self.location.origin)return;
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(async windows=>{
    for(const client of windows){if(new URL(client.url).origin===url.origin){await client.focus();return}}
    return clients.openWindow(url.href)
  }));
});
