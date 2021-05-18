const addBtn = document.getElementById('add');

const notes = JSON.parse(localStorage.getItem('notes'));
let c = 0;
if(notes){
    notes.content.forEach(note =>{
        addNewNote(note);
    });

    notes.colors.forEach((color, index) => {
        document.querySelectorAll('.note')[index].style.backgroundColor = color;
        let lum = 0;
        if(color.replace(/[^0-9]/g,'').length == 0){
            lum = 27;
        }else{
            for(let i = 0; i<color.replace(/[^0-9]/g,'').length; i++){
                lum += parseInt(color.replace(/[^0-9]/g,'')[i]);
            }
        }
        if(lum >=17){
            document.querySelectorAll('.main')[index].style.color = 'rgba(0,0,0)';
            document.querySelectorAll('textarea')[index].style.color ='rgba(0,0,0)';
        }else{
            document.querySelectorAll('.main')[index].style.color = 'rgba(255,255,255)';
            document.querySelectorAll('textarea')[index].style.color = 'rgba(255,255,255)';
        }
    });
}

addBtn.addEventListener('click', ()=>{
    addNewNote();
});

function addNewNote(text = ''){
    const note = document.createElement('div');
    note.classList.add('note');

    note.innerHTML = `
            <div class="tools">
                <label for="colors${c}">
                    <i class="fa fa-palette" ></i>
                    <input type="color" class ="color" id="colors${c}" style="opacity: 0; pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$">
                </label>
                <div>
                    <button title="save/edit" class="edit"><i class="fas fa-edit"></i></button>
                    <button title ="delete" class="delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
            <div class="main ${text ? "" : "hidden"}"></div>
            <textarea class="${text ? "hidden" : ""}"></textarea>
    `;

    const colorBtn =  note.querySelector('.color')
    const editBtn = note.querySelector('.edit');
    const deleteBtn = note.querySelector('.delete');

    const main = note.querySelector('.main');
    const textArea = note.querySelector('textarea');

    textArea.value = text;
    main.innerHTML = marked(text);

    editBtn.addEventListener('click', ()=>{
        main.classList.toggle('hidden');
        textArea.classList.toggle('hidden');
        textArea.focus();
    });

    deleteBtn.addEventListener('click', () => {
        note.remove();
        updateLS();
    });

    textArea.addEventListener('input', e =>{
        const {value} = e.target;

        main.innerHTML = marked(value);

        updateLS();
    });

    colorBtn.addEventListener('change',()=>{
        note.style.backgroundColor = colorBtn.value;

        let lum = 0;
        if(colorBtn.value.replace(/[^0-9]/g,'').length == 0){
            lum = 27;
        }else{
            for(let i = 0; i<colorBtn.value.replace(/[^0-9]/g,'').length; i++){
                lum += parseInt(colorBtn.value.replace(/[^0-9]/g,'')[i]);
            }
        }
        if(lum >= 17){
            console.log('lum ta fuderoso')
            note.querySelector('.main').style.color = 'rgba(0,0,0)';
            note.querySelector('textarea').style.color ='rgba(0,0,0)';
        }else{
            console.log('lum ta baixo')
            note.querySelector('.main').style.color = 'rgba(255,255,255)';
            note.querySelector('textarea').style.color = 'rgba(255,255,255)';
        }
        updateLS();
    });

    document.querySelector('.notes').appendChild(note);
    c++;
}

function updateLS(){
    const notesText = document.querySelectorAll('textarea');
    const notesColor = document.querySelectorAll('.note');

    const notes = {
        content: [],
        colors: []
    };

    notesText.forEach(note => {
        notes.content.push(note.value);
    });

    notesColor.forEach(note => {
        notes.colors.push(note.style.backgroundColor);
    });

    localStorage.setItem('notes', JSON.stringify(notes));
}