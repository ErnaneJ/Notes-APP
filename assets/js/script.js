document.addEventListener('keydown', e => {if(e.key === 's' && e.ctrlKey)e.preventDefault()});
let interval;
const rgbToHex = color => {
    if(!color) return;
    const r = parseInt(color.split("(")[1].split(",")[0])
    const g = parseInt(color.split("(")[1].split(",")[1])
    const b = parseInt(color.split("(")[1].split(",")[2].split(")")[0])
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
const addBtn = document.getElementById('add');
let notes = JSON.parse(localStorage.getItem('notes'));
let c = 0;
if(notes) loadNotes();

function loadNotes(){
    notes = JSON.parse(localStorage.getItem('notes'));
    notes.content.forEach(note => addNewNote(note));
    notes.colorBg.forEach((color, index) => {
        document.querySelectorAll('.note')[index].style.backgroundColor = color;
        document.querySelector(`#colorBg${index}`).value = rgbToHex(color);
    });
    notes.colorLetter.forEach((color, index) => {
        document.querySelectorAll('.note .main')[index].style.color = color;
        document.querySelectorAll('.note textarea')[index].style.color = color;
        document.querySelector(`#colorsLetter${index}`).value = rgbToHex(color);
    });
    enableInputs();
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
                    </label>
                    <label for="colorsLetter${c}">
                        <i title="Change color letters." class="fas fa-tint"></i>
                    </label>
                    <div class="input-colors">
                        <input type="color" class="colorBg" id="colorBg${c}" name="colorBg${c}" style="opacity: 0;pointer-events: none;" >
                        <input type="color" class="colorLetter" id="colorsLetter${c}" name="colorsLetter${c}" style="opacity: 0;pointer-events: none;">
                    </div>
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

    main.addEventListener('dblclick', function (e) {
        main.classList.toggle('hidden');
        textArea.classList.toggle('hidden');
        textArea.focus();
    });

    textArea.addEventListener('keydown', e => {
        if(e.key === 's' && e.ctrlKey){
            e.preventDefault();
            main.classList.toggle('hidden');
            textArea.classList.toggle('hidden');
            textArea.focus();
        }
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

    colorBgBtn.addEventListener('input', ()=>{
        note.style.backgroundColor = colorBgBtn.value;updateLS();
    });
    colorLetterBtn.addEventListener('input', ()=>{
        note.querySelector('textarea').style.color = colorLetterBtn.value;
        note.querySelector('.main').style.color = colorLetterBtn.value;
        updateLS();
    });
    document.querySelector('.notes').appendChild(note);
    c++;
}
function enableInputs(){
    document.querySelectorAll(`input[type="checkbox"]`).forEach((input, i) => {
        input.removeAttribute('disabled');
        input.id = "checkbox"+i ;
        input.addEventListener('change', () => {
            let liText = clearEntry(input.parentNode.innerHTML.toString().replace(/(\<input).+(\"\>)/, ""));
            const textArea = Array.from(document.querySelectorAll('textarea')).filter(ta => ta.value.includes(liText.trim()))[0];
            let parent = input
            let main = null;
            while(main == null){
                parent = parent.parentElement
                if(parent.classList.contains('main')) main = parent;
            }
            if (input.checked) {
                textArea.value = textArea.value.replace(`- [ ] ${liText.trim()}`, `- [x] ~~${liText.trim()}~~`) 
            } else {
                textArea.value = textArea.value.replace(`- [x] ${liText.trim()}`, `- [ ] ${liText.trim().replace(/\~\~/g,"")}`) 
            }
            main.innerHTML = marked(textArea.value);
            updateLS();
        });
    })}
function clearEntry(txt){
    return (
        txt.replace(/(\<code\>)|(\<\/code\>)/g, "`")
        .replace(/(\<del\>)|(\<\/del\>)/g, "~~")
    );
}
function updateLS(){
    enableInputs();
    const notesText = document.querySelectorAll('textarea');
    const notesMain = document.querySelectorAll('.note .main');
    const notesColor = document.querySelectorAll('.note');

    const notes = {content: [],colorBg: [],colorLetter: []};
    
    notesMain.forEach(main => notes.colorLetter.push(main.style.color))
    notesText.forEach(text => notes.content.push(text.value ?? ""));
    notesColor.forEach(note => notes.colorBg.push(note.style.backgroundColor));

    localStorage.setItem('notes', JSON.stringify(notes));
}