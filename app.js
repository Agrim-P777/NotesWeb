class App {
    constructor() {
      this.notes = JSON.parse(localStorage.getItem('notes')) || [];
      this.title='';
      this.text='';
      this.id='';

      this.$modal = document.querySelector('.modal');
      this.$modalTitle = document.querySelector('.modal-title');
      this.$modalText = document.querySelector('.modal-text');
      this.$modalCloseButton = document.querySelector('.modal-close-button');
      this.$form = document.querySelector('#form'); 
      this.$noteTitle = document.querySelector('#note-title');
      this.$noteText = document.querySelector('#note-text');
      this.$formButtons = document.querySelector('#form-buttons'); 
      this.$closebtn = document.querySelector('#form-close-button');
      this.$notes = document.querySelector('#notes');
      this.$placeholder = document.querySelector('#placeholder');   
      this.$colorTooltip = document.querySelector('#color-tooltip');

      this.displayNotes();
      this.addEventListeners();
    }   
    
    addEventListeners(){
        document.body.addEventListener('click',event=>{
            this.handleFormClick(event);
            this.selectNote(event);
            this.openModal(event);
            this.deleteNote(event);
            
        });
        
        document.body.addEventListener('mouseover', event=>{
            this.openTooltip(event);
            
        })

        document.body.addEventListener('mouseout', event => {
            this.closeTooltip(event);  
         });

        this.$colorTooltip.addEventListener('mouseover',function(){
            this.style.display = 'flex';
        });
        
        this.$colorTooltip.addEventListener('mouseout',function(){
            this.style.display = 'none';
        }); 

        this.$colorTooltip.addEventListener('click',event=>{
            const color = event.target.dataset.color;
            if(color){
                this.editColor(color);
            }
        });

        this.$form.addEventListener('submit', event=>{
            event.preventDefault();
            const text = this.$noteText.value;
            const title = this.$noteTitle.value;
            const hasNote = text || title;
            if(hasNote){
            this.addNote({title, text});
            }
        })

        this.$closebtn.addEventListener('click',event=>{
            event.stopPropagation();
            this.closeForm();
        })

        this.$modalCloseButton.addEventListener('click',event=>{
            this.closeModal(event);
        })
    }

    handleFormClick(event){
        const isFormClicked = this.$form.contains(event.target);
        const text = this.$noteText.value;
        const title = this.$noteTitle.value;
        const hasNote = text || title;
        if(isFormClicked){
            this.openForm();
        } else if(hasNote){
            this.addNote({title, text});
        } else {
            this.closeForm();
        }
    }

    openForm(){
        this.$form.classList.add('form-open');
        this.$noteTitle.style.display = 'block';
        this.$formButtons.style.display = 'block';
    }

    closeForm(){
        this.$form.classList.remove('form-open');
        this.$noteTitle.style.display = 'none';
        this.$formButtons.style.display = 'none';
        this.$noteTitle.value = '';
        this.$noteText.value = '';
    }

    openModal(event){
        if (event.target.matches('.toolbar-delete')) return; 

        if(event.target.closest('.note')){
            this.$modal.classList.toggle('open-modal');
            this.$modalTitle.value = this.title;
            this.$modalText.value = this.text;
        }
    }

    closeModal(event){
        this.editNote();
        this.$modal.classList.toggle('open-modal');
    }

    openTooltip(event){
        if (!event.target.matches('.toolbar-color')) return;
        this.id = event.target.dataset.id; 
        const noteCoords = event.target.getBoundingClientRect();
        const horizontal = noteCoords.left + window.scrollX;
        const vertical = noteCoords.top + window.scrollY;
        this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
        this.$colorTooltip.style.display = 'flex';
    }

    closeTooltip(event){
        if (!event.target.matches('.toolbar-color')) return;
        this.$colorTooltip.style.display = 'none';
    }

    selectNote(event){
        const $selectedNote = event.target.closest('.note');
        if(!$selectedNote) return;
        const [$noteTitle, $noteText] = $selectedNote.children;
        this.title =  $noteTitle.innerText;
        this.text = $noteText.innerText;
        this.id = $selectedNote.dataset.id;
    }


    addNote({title, text}){
        const newNote = {
            title,
            text,
            color: 'white',
            id: this.notes.length>0 ? (this.notes[this.notes.length-1].id+1) :1
        };
        this.notes = [...this.notes, newNote];
        this.displayNotes();
        this.closeForm();
    }

    editNote(){
        const title = this.$modalTitle.value;
        const text = this.$modalText.value;        
        this.notes = this.notes.map(note =>{
           return (note.id === Number(this.id)) ? { ...note, title, text} : note            
        });
        this.displayNotes();
    }

    editColor(color){
        this.notes = this.notes.map(note=>
            (note.id === Number(this.id))?{...note, color}:note
        );
        this.displayNotes();
    }

    deleteNote(event){
        event.stopPropagation();
        if(!event.target.matches('.toolbar-delete')) return;
        const id = event.target.dataset.id;
        this.notes = this.notes.filter(note=> note.id !== Number(id));
        this.displayNotes();
    }

    saveNotes(){
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }

    displayNotes(){
        this.saveNotes();
        const hasNotes = this.notes.length>0;
        this.$placeholder.style.display = hasNotes ? 'none':'flex';
        this.$notes.innerHTML = this.notes.map(note=>{
            return `
            <div style="background: ${note.color};" class="note" data-id='${note.id}'>
                <div class="${note.title && 'note-title'}">${note.title}</div>
                <div class="note-text">${note.text}</div>
                <div class="toolbar-container">
                    <div class="toolbar">
                    <img class="toolbar-color" data-id=${note.id} src="icons/pallete.png">
                    <img class="toolbar-delete" data-id=${note.id} src="icons/trash-can.png">
                    </div>
                </div>
            </div> `       
        }).join('');
    }
  }
  
new App()