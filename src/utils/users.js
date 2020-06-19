const users=[]

//adduser,removeuser,getUser,getUserInRoom
const addUser = ({id,username,room})=>{
    //clean data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate
    if(!username||!room ){
        return{
            error:'Username or room required'
        }
    }

    //check existing
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    //validate username
    if(existingUser){
        return{
            error:'Username is in use'
        }
    }

    //store user
    const user = {id,username,room}
    users.push(user)
    return {user}
}

const removeUser = (id)=>{
    const index = users.findIndex((user)=>user.id === id)
    if (index!==-1){
        return users.splice(index,1)[0]
    }
}

addUser({
    id:22,
    username:'Andrew',
    room:'South'

})

addUser({
    id:33,
    username:'Pepe',
    room:'South'

})
//console.log(users)
// const removeduser = removeUser(22)

// console.log(removeduser)
// console.log(users)

const getUser = (id)=>{
    // const index = users.findIndex((user)=>user.id === id)
    // if (index!==-1){
    //     return users[index]
    // } else{
    //     return undefined
    // }
    return users.find((user)=>user.id===id)
}

const getUserInRoom=(room)=>{
    return users.filter((user)=>user.room ===room)
    
}

const userList = getUserInRoom('south')
console.log(userList)


module.exports={
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}