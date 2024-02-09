import { ChangeEvent, useState } from 'react'
import logo from './assets/logo-nlw-expert.svg'
import { NewNoteCard } from './components/NewCard'
import { NoteCard } from './components/NoteCard'

interface Note {
  id: string 
  date: Date 
  content: string
}

export function App() {  
  const [search, setSearch] = useState('')
 

  const [notes, setNotes] = useState<Note[]>(() => {

    const notesOnStorage = localStorage.getItem('notes') 


    if (notesOnStorage){
      return JSON.parse(notesOnStorage)
    }


    return []
  }) 


function onNoteCreated(content:string) {
  const newNote = { 
    // Gerar id unico
    id: crypto.randomUUID(), 
    date: new Date(), 
    content,
  } 


  const notesArray = [newNote, ...notes] 

  setNotes(notesArray) 

  localStorage.setItem('notes', JSON.stringify(notesArray))
}


function handleSearch(event: ChangeEvent<HTMLInputElement>) {
  const query = event.target.value 

  setSearch(query) 

}  

function onNoteDeleted (id: string){
  const notesArray = notes.filter(notes => {
    return notes.id !== id
  }) 

  setNotes(notesArray) 
  localStorage.setItem('notes', JSON.stringify(notesArray))
}
const filteredNotes = search !== '' 
 ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
 : notes 


  return (  
    <div className='mx-auto max-w-6xl my-12 space-y-6 px-5 '> 
      <img src={logo} alt="logo nlw expert" />  

      <form className='w-full'>  
        <input 
          type="text" 
          placeholder='Busque suas notas...' 
          className='w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500' 
          onChange={handleSearch}
        />
      </form> 

      {/* SEPARADOR */}
      <div className='h-px bg-slate-700'/>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">  
        <NewNoteCard onNoteCreated={onNoteCreated}/>
        
        {filteredNotes.map(note => {
          return <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted}/>
        })}
        
      
      </div>
      
    </div>
    
  )
}

