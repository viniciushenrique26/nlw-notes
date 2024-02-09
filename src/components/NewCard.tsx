import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'   
import Sound from '../assets/notification.wav' 
import RecordingSound from '../assets/recording.wav' 

import { ChangeEvent, FormEvent, useState } from 'react' 
import {toast} from 'sonner'



interface NewNoteCardProps {
    onNoteCreated: (content: string) => void
} 

let speechRecognition: SpeechRecognition | null = null


export function NewNoteCard ({onNoteCreated}: NewNoteCardProps){ 
    const [isRecording, setIsRecording] = useState(false)
    const [shouldShowOnboarding, setShouldShowOnboarding ]= useState(true) 
    const [content, setContent] = useState('')
    
   

    function handleStartEditor () {
        setShouldShowOnboarding(false)
    } 

    function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>){
        setContent(event.target.value)
        
        if(event.target.value === ''){
            setShouldShowOnboarding(true)
        }
    }

    function handleSaveNote(event: FormEvent){ 
        event.preventDefault() 

        if(content === ''){
            return
        }


        onNoteCreated(content)

        setContent('')
        setShouldShowOnboarding(true)

        toast.success('Nota criada com sucesso!')
    } 

    function handleStartRecording(){
        


        const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window 
            || 'webkitSpeechRecognition' in window 

            if(!isSpeechRecognitionAPIAvailable) {
                alert('Seu navegador não suporta a API de gravação.') 
                return
            } 
        
        
        setIsRecording(true)  
        setShouldShowOnboarding(false)

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition 

        speechRecognition = new SpeechRecognitionAPI()  

        speechRecognition.lang = 'pt-BR'  
        speechRecognition.continuous = true 
        speechRecognition.maxAlternatives = 1 
        speechRecognition.interimResults = true 

        speechRecognition.onresult = (event) => {
            const transcription = Array.from(event.results).reduce((text, result)=>{
                return text.concat(result[0].transcript)
            }, '') 
            setContent(transcription)
        } 

        speechRecognition.onerror = (event) => {
            console.error(event)
        } 

        speechRecognition.start()
    } 

    function handleStopRecording(){
        setIsRecording(false) 

        if(speechRecognition !== null) {
            speechRecognition.stop()
        }
    }
    function play(sound: string){
        new Audio(sound).play()  
       
        
    }
  return (  
    <Dialog.Root>
        <Dialog.Trigger className='rounded-md flex flex-col bg-slate-700 p-5 text-left gap-3 hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none'>
          <span className='text-sm font-medium text-slate-200'>
            Adicionar nota
          </span> 
          <p className='text-sm leading-6 text-slate-400'>
            Grave uma nota em áudio e será convertido em texto automaticamente. 
          </p>
        </Dialog.Trigger> 

        <Dialog.Portal> 
            <Dialog.Overlay className='inset-0 fixed bg-black/50'/> 
            <Dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2  md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none'>
                <Dialog.Close className='absolute right-0 top-0 bg-slate-800 rounded p-1 text-slate-400 hover:text-slate-100'>
                    <X className='size-5'/>
                </Dialog.Close> 

                <form  className='flex-1 flex flex-col'>

                    <div className='flex flex-1 flex-col gap-3 p-5'>
                        <span className='text-sm font-medium text-slate-300'>
                        Adicionar nota
                        </span> 


                        {shouldShowOnboarding ? (
                            <p className='text-sm leading-6 text-slate-400'>
                                Comece <button type="button" onClick={function(){ play(RecordingSound); handleStartRecording()}} className='text-lime-500 hover:underline font-medium cursor-pointer'> gravando uma nota </button> em áudio ou se preferir <button type='button' onClick={handleStartEditor} className='text-lime-500 font-medium hover:underline cursor-pointer '> utilize apenas texto </button>.
                            </p>
                        ) : (
                            <textarea 
                            autoFocus 
                            className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none' 
                            onChange={handleContentChanged} 
                            value={content}/>
                        )} 
                    </div> 
                    
                    {isRecording ? (
                        <button
                        type='button'   
                        onClick={handleStopRecording}
                        className=' w-full bg-slate-900 py-4 text-center text-red-400 text-sm outline-none font-medium hover:text-red-600 flex flex-row items-center justify-center gap-1' 
                        > 
                        <div className='size-3 rounded-full bg-red-400 animate-pulse'></div>
                        <span className='animate-pulse font-bold'> Gravando</span>  <span className='text-slate-600 ml-1'> (clique p/ interromper) </span> 
                        </button> 
                    ) : (
                        <button
                            type='button'  
                            onClick= {function(event){ play(Sound); handleSaveNote(event)}}
                            className='w-full bg-lime-400 text-slate-950 py-4 text-center text-sm outline-none font-medium hover:bg-lime-500 ' 
                        >
                            Salvar nota
                        </button> 
                    ) }


                  
                </form>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
    
  )
}
 