const addBtn = document.getElementById('add');

const notes = JSON.parse(localStorage.getItem('notes'));
let c = 0;
console.log(notes)
if(notes){
    notes.content.forEach(note => addNewNote(note));
    notes.colorBg.forEach((color, index) => document.querySelectorAll('.note')[index].style.backgroundColor = color);
    notes.colorLetter.forEach((color, index) => {
        console.log(color)
        document.querySelectorAll('.note .main')[index].style.color = color});
}

addBtn.addEventListener('click', ()=>{
    addNewNote();
});

function addNewNote(text = ''){
    const note = document.createElement('div');
    note.classList.add('note');

    note.innerHTML = `
            <div class="tools">
                <div class="left">
                    <label for="colorBg${c}">
                        <i title="Change background color." class="fa fa-palette" ></i>
                        <input type="color" hidden class="colorBg" id="colorBg${c}" name="colorBg${c}" style="opacity: 0;" pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$">
                    </label>
                    <label for="colorsLetter${c}">
                        <i title="Change color letters." class="fas fa-tint"></i>
                        <input type="color" hidden class="colorLetter" id="colorsLetter${c}" name="colorsLetter${c}" style="opacity: 0;" pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$">
                    </label>
                </div>
                <div class="rigth">
                    <button title="save/edit" class="edit"><i class="fas fa-edit"></i></button>
                    <button title ="delete" class="delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
            <div class="main ${text ? "" : "hidden"}"></div>
            <textarea class="${text ? "hidden" : ""}"></textarea>
    `;

    const colorBgBtn =  note.querySelector('.colorBg')
    const colorLetterBtn =  note.querySelector('.colorLetter')
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

    colorBgBtn.addEventListener('change', ()=>{
        note.style.backgroundColor = colorBgBtn.value;
        updateLS();
    });

    colorLetterBtn.addEventListener('change', ()=>{
        note.querySelector('.main').style.color = colorLetterBtn.value;
        updateLS();
    });

    document.querySelector('.notes').appendChild(note);
    c++;
}

function updateLS(){
    const notesText = document.querySelectorAll('textarea');
    const notesMain = document.querySelectorAll('.note .main');
    const notesColor = document.querySelectorAll('.note');

    const notes = {content: [],colorBg: [],colorLetter: []};
    
    notesMain.forEach(main => notes.colorLetter.push(main.style.color))
    notesText.forEach(text => notes.content.push(text.value ?? ""));
    notesColor.forEach(note => notes.colorBg.push(note.style.backgroundColor));

    localStorage.setItem('notes', JSON.stringify(notes));
}