const socket = io()



// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('clicked')
//     socket.emit('increment')
// })
//elements
const $messageForm=document.querySelector('#message-form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $sendLocationButton=document.querySelector('#send-location')
const $messages= document.querySelector('#messages')
//const $location= document.querySelector('#location')

const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML


//options
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})


const autoscroll=()=>{
   // เอา message หลังสถด
   const $newMessage = $messages.lastElementChild

   //
   const newMessageStyles = getComputedStyle($newMessage)
   const newMessageMargin = parseInt(newMessageStyles.marginBottom)
   const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

   // console.log(newMessageStyles)
   const visibleHeight = $messages.offsetHeight

   //Height of message container
   const containerHeight = $messages.scrollHeight

   //How far have i scrolled
   const scrollOffset = ($messages.scrollTop + visibleHeight)*2

   if(containerHeight - newMessageHeight < scrollOffset){
      $messages.scrollTop = $messages.scrollHeight
   }



}

///function ที่เอาไว้ printt
socket.on('message',(msg)=>{
   console.log(msg)
   const html = Mustache.render(messageTemplate,{
      username:msg.username,
      msg:msg.text,
      createdAt:moment(msg.createdAt).format('h:mm a')
   })
   $messages.insertAdjacentHTML('beforeend',html)
   autoscroll()
})

socket.on('locationMessage',(url)=>{
   console.log(url)
   const html = Mustache.render(locationTemplate,{
      username:url.username,
      url:url.url,
      createdAt:moment(url.createdAt).format('h:mm a')
   })
   $messages.insertAdjacentHTML('beforeend',html)
   autoscroll()
})

socket.on('roomData',({room,users})=>{
   const html = Mustache.render(sidebarTemplate,{
      room,
      users
   })
   document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit',(e)=>{
   e.preventDefault()

   $messageFormButton.setAttribute('disabled','disabled')
   //disable
   const message = e.target.elements.message.value
   socket.emit('sendMessage',message,(error)=>{
      //enable
      $messageFormButton.removeAttribute('disabled')
      $messageFormInput.value=''
      $messageFormInput.focus()

      if(error){
         return console.log(error)
      }
      return console.log('Delivered')
   })
    
})

$sendLocationButton.addEventListener('click',()=>{
   
   
   if (!navigator.geolocation){
      return alert('geolocation not support') 
   }

   $sendLocationButton.setAttribute('disabled','disabled')

   navigator.geolocation.getCurrentPosition((position)=>{
   // const location = 'Long: '+position.coords.longitude+' Lat: '+position.coords.latitude
    socket.emit('sendLocation',{
       latitude: position.coords.latitude,
       longtitude: position.coords.longitude
    },(msg)=>{
      $sendLocationButton.removeAttribute('disabled')
      return console.log(msg)
    })
   })
})

socket.emit('join',{username,room},(error)=>{
   if (error){
      alert(error)
      location.href = '/'
   }
})