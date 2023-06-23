import { showAlert } from "./alerts.js";

const login = async(email,password) => {
    try{
        const res=await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password
            }
        });

        if(res.data.status==='success'){
            showAlert('success','Logged in successfully!');
            window.setTimeout(()=>{
                location.assign('/');
            },500);
        } 
    }
    catch(err){
        showAlert('error',err.response.data.message);
    }
}

const logout =async () => {
    try{
        const res= await axios({
            method: 'GET',
            url: '/api/v1/users/logout'
        });
        if(res.data.status==='success'){
            // location.reload(true);
            window.setTimeout(()=>{
                location.assign('/');
            },500);
        }    
    }
    catch(err){
        showAlert('error','Error logging out! Try again.')
    }
}

// Type is either 'password' or 'data'
const updateSettings = async(data,type) => {
    try{
        const url = type === 'password' ? '/api/v1/users/updateMyPassword' : '/api/v1/users/updateMe';
        const res = await axios({
            method: 'PATCH',
            url,
            data
        });
        if(res.data.status==='success'){
            showAlert('success',`${type.toUpperCase()} updated successfully!`);
        }
    }
    catch(err){
        showAlert('error',err.response.data.message);
    }
}

const form=document.querySelector('.form--login');
if(form){
    form.addEventListener('submit', e => {
        e.preventDefault();
        const email=document.getElementById('email').value;
        const password=document.getElementById('password').value;
        login(email,password);
    });
}

const logOutBut=document.querySelector('.nav__el--logout');
if(logOutBut) logOutBut.addEventListener('click',logout);

const userDataForm=document.querySelector('.form-user-data');
if(userDataForm){
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const name=document.getElementById('name').value;
        const email=document.getElementById('email').value;
        updateSettings({name,email},'data');
    });
}

const userPasswordForm=document.querySelector('.form-user-password');
if(userPasswordForm){
    userPasswordForm.addEventListener('submit',async e => {
        e.preventDefault();
        document.querySelector('.btn--save-password').innerHTML='Updating...';

        const passwordCurrent=document.getElementById('password-current').value;
        const password=document.getElementById('password').value;
        const passwordConfirm=document.getElementById('password-confirm').value;
        await updateSettings({passwordCurrent,password,passwordConfirm},'password');
        
        document.querySelector('.btn--save-password').innerHTML='Save password';
        document.getElementById('password-current').value='';
        document.getElementById('password').value='';
        document.getElementById('password-confirm').value='';
    });
}