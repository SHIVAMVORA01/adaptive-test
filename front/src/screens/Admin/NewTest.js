import React,{useEffect,useState} from 'react'
import { Col, Row } from 'react-bootstrap';
import { useLocation} from 'react-router-dom';
import { useNavigate } from "react-router";
import Clock from '../../img/Clock.svg'
import '../../css/AdminHomeScreen.css';
import $ from "jquery";
import axios from 'axios';
import sidFunc from './sidFunc';
import TimeField from 'react-simple-timefield';
import axiosInstance from "../../axios";

function NewTest() {
    //Current Sec Data
    const[easy,setEasy] = useState([])
    const[med,setMed] = useState([])
    const[hard,setHard] = useState([])
    const[qs,setQs] = useState(0)
    const[time,setTime] = useState('00:00:20')
    const[axData,setAxData] = useState({})


    const[aptDic,setAptDic] = useState({'time':'00:00:20','totalQs':1})
    const[CFDic,setCFDic] = useState({'time':'00:00:20','totalQs':1})
    const[DDic,setDDic] = useState({'time':'00:00:20','totalQs':1})
    const[PDic,setPDic] = useState({'time':'00:00:20','totalQs':1})
    const[CDic,setCDic] = useState({'time':'00:00:20','totalQs':1})
    const[AWDic,setAWDic] = useState({'time':'00:00:20','totalQs':1})

    const[CurrentDic,setCurrentDic] = useState({'time':'00:00:20','totalQs':1})
    
    
    const[sectionName,setSectionName] = useState([])
    const[sid,setSid] = useState(0)
    //

    const location = useLocation();
    const navigate = useNavigate()

    function saveTest(e){
        e.preventDefault()
        console.log(aptDic)
        console.log(CFDic)
        console.log(DDic)
        console.log(PDic)
        console.log(CDic)
        console.log(AWDic)
        let a=[
            {sub:'Aptitude',time:aptDic.time,totalQs:aptDic.totalQs},
            {sub:'Computer Fundamentals',time:CFDic.time,totalQs:CFDic.totalQs},
            {sub:'Domain',time:DDic.time,totalQs:DDic.totalQs},
            {sub:'Personality',time:PDic.time,totalQs:PDic.totalQs},
            {sub:'Coding',time:CDic.time,totalQs:CDic.totalQs},
            {sub:'Analytical Writing',time:AWDic.time,totalQs:AWDic.totalQs},
        ]
        axiosInstance.post("api/admin/saveTest", { saveTest: a }).then((res) => {      
            //after saving add value to --->navArray
            navigate("/admin/home");
          });

    }

    function secOnCLick(e,index){
        console.log(e.target.innerText)
        var d=axData
        var Wssid=sidFunc(index)
        setSid(index+1)
           console.log(d[Wssid])
            setSectionName(Wssid)
            setEasy(d[Wssid].easy)
            setHard(d[Wssid].hard)
            setMed(d[Wssid].medium)
            setQs(d[Wssid].qs)
            //setTime(d[Wssid].time)
            console.log(AWDic)
            
            if(d[Wssid].medium.length>0){
                if(index===1){
                    setCurrentDic(CFDic)
                }else if(index===2){
                    setCurrentDic(DDic)
                }
                else if(index===3){setCurrentDic(PDic)}
                else if(index==4){setCurrentDic(CDic)}
                else if(index==5){setCurrentDic(AWDic)}
                else if (index===0){setCurrentDic(aptDic)}
        }else{
            if(index===1){
                setCurrentDic({time:CFDic.time,totalQs:0})
            }else if(index===2){
                setCurrentDic({time:DDic.time,totalQs:0})
            }
            else if(index===3){setCurrentDic({time:PDic.time,totalQs:0})}
            else if(index==4){setCurrentDic({time:CDic.time,totalQs:0})}
            else if(index==5){setCurrentDic({time:AWDic.time,totalQs:0})}
            else if (index===0){setCurrentDic({time:aptDic.time,totalQs:0})}

        }

        $(e.target).addClass('sectionOnCLickToggle')

        Array.from(document.querySelectorAll('.sectionClick')).forEach(function(el) { 
            if(e.target!==el){
           el.classList.remove('sectionOnCLickToggle')
        }
        });
    }
    
    $( document.getElementById('listSec') ).ready(function() {
        console.log( "ready!" );
        Array.from(document.querySelectorAll('.sectionClick')).forEach(function(el,index) { 
            if(index+1===sid){
                el.classList.add('sectionOnCLickToggle')
            }
        });

    });

    useEffect(() => {
        var ssid;
        if(localStorage.getItem('isNewTestReload')!==null){
            ssid=0
            setSid(ssid+1)
            
        }else{
            localStorage.setItem('isNewTestReload',false)
            ssid=location.state.sid
            setSid(ssid+1)
        }
        
        
        const data =async ()=>await axios.get(`http://127.0.0.1:8000/api/subs`)
        .then(res=>{
            var d=res.data.data
            console.log(d)
            setAxData(d)
        
            //For Aptitude
           var Wssid=sidFunc(ssid)
           console.log(d[Wssid])
            setSectionName(Wssid)
            setEasy(d[Wssid].easy)
            setHard(d[Wssid].hard)
            setMed(d[Wssid].medium)
            setQs(d[Wssid].qs)
            //setTime(d[Wssid].time)
            if(d[Wssid].medium.length!==0){
            setCurrentDic(aptDic)
            }else{
                setCurrentDic({time:'00:00:20',totalQs:0}) 
            }
            
        })
        .catch(e=>{
            console.log(e)
        })
        data()
     }, []);
    return (
        <Row>
        <Col md={3}> <div className='basicRec' id='listSec' style={{height:'70%',marginTop:'20%',overflow:'hidden'}}>
            <Row>
                <Col md={12}><div className='sectionClick' onClick={(e)=>secOnCLick(e,0)}>Aptitude</div></Col>
            </Row>
            <Row>
                <Col md={12}><div className='sectionClick' onClick={(e)=>secOnCLick(e,1)}>Computer Fundamentals</div></Col>
            </Row>
            <Row>
                <Col md={12}><div className='sectionClick' onClick={(e)=>secOnCLick(e,2)}>Domain</div></Col>
            </Row>
            <Row>
                <Col md={12}><div className='sectionClick' onClick={(e)=>secOnCLick(e,3)}>Personality</div></Col>
            </Row>
            <Row>
                <Col md={12}><div className='sectionClick' onClick={(e)=>secOnCLick(e,4)}>Coding</div></Col>
            </Row>
            <Row>
                <Col md={12}><div className='sectionClick' onClick={(e)=>secOnCLick(e,5)}>Analytical Writing</div></Col>
            </Row>
            
          
            </div></Col>
        <Col>  
        <div className='mainRec'>
           <form onSubmit={saveTest}>
                <div className='AdminSetSection'>
            <div className='basicRec secNm'>{sectionName}</div>
           <Row style={{margin:'44px 0',padding:'0px 0px'}}> 
           <Col style={{padding:'0px'}}><div className='basicRec avQs' >
               Available Question
               <Row style={{padding:'20px 10px 0px 40px'}}>
                   <Col><Row className='remQs'>{easy.length}</Row></Col>
                   <Col><Row className='remQs'>{med.length}</Row></Col>
                   <Col><Row className='remQs'>{hard.length}</Row></Col>
                   
               </Row>
               <Row style={{padding:'0px 15px 0px 30px'}} >
                   <Col style={{padding:'0px 0px 0px 15px'}}>Easy</Col>
                   <Col >Medium</Col>
                   <Col><Row style={{padding:'0px 0px 0px 15px'}}>Hard</Row></Col>
                   
               </Row>
               </div></Col>
           <Col style={{padding:'0px'}}>
           <Row><Col><div className='basicRec easyMedHard'  style={{marginBottom:'28px',padding:'11px 10px'}} onClick={(e)=>{navigate('/admin/setQs',{state:{type:'Easy',sectionName:sectionName,sid:sid,navArr:easy}})}}>Easy</div></Col></Row>
           <Row><Col><div className='basicRec easyMedHard' style={{marginBottom:'28px',padding:'11px 10px'}} onClick={(e)=>{navigate('/admin/setQs',{state:{type:'Medium',sectionName:sectionName,sid:sid,navArr:med}})}}>Medium</div></Col></Row>
           <Row><Col><div className='basicRec easyMedHard' style={{padding:'11px 10px'}} onClick={(e)=>{navigate('/admin/setQs',{state:{type:'Hard',sectionName:sectionName,sid:sid,navArr:hard}})}}>Hard</div></Col></Row>
           </Col>
           </Row>
           <Row style={{margin:'44px 0'}}> <Col><div className='basicRec easyMedHard' style={{marginBottom:'28px',width: '90%',padding:'11px 10px'}}>
             <TimeField showSeconds className='timeFieldInput' id='timeFieldInput1' minTime='00:00:20'
               onChange={(e,value)=>{console.log(e.target.value);
                var hms = e.target.value;   // your input string
                var a = hms.split(':'); // split it at the colons

                // minutes are worth 60 seconds. Hours are worth 60 minutes.
                var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 

                console.log(seconds);
                if(seconds>19){
                if(sid-1===1){
                
                setCFDic({time:e.target.value,totalQs:CurrentDic.totalQs})
            }else if(sid-1===2){
                setDDic({time:e.target.value,totalQs:CurrentDic.totalQs})
            }
            else if(sid-1===3){setPDic({time:e.target.value,totalQs:CurrentDic.totalQs})}
            else if(sid-1==4){setCDic({time:e.target.value,totalQs:CurrentDic.totalQs})}
            else if(sid-1==5){setAWDic({time:e.target.value,totalQs:CurrentDic.totalQs})}
            else if (sid-1===0){setAptDic({time:e.target.value,totalQs:CurrentDic.totalQs})}
            setCurrentDic({time:e.target.value,totalQs:CurrentDic.totalQs})
        }else{
          alert('Minimum time should be 20 secs')

          if(sid-1===1){
                
            setCFDic({time:'00:59:59',totalQs:CurrentDic.totalQs})
        }else if(sid-1===2){
            setDDic({time:'00:59:59',totalQs:CurrentDic.totalQs})
        }
        else if(sid-1===3){setPDic({time:'00:59:59',totalQs:CurrentDic.totalQs})}
        else if(sid-1==4){setCDic({time:'00:59:59',totalQs:CurrentDic.totalQs})}
        else if(sid-1==5){setAWDic({time:'00:59:59',totalQs:CurrentDic.totalQs})}
        else if (sid-1===0){setAptDic({time:'00:59:59',totalQs:CurrentDic.totalQs})}
           setCurrentDic({time:'00:59:59',totalQs:CurrentDic.totalQs})
        }
            }}
          style={{ width: "80px",border:'none' }}
          value={CurrentDic.time}/> 
           <img style={{height:'25px',float:'right'}} alt="logo" src={Clock} onClick={(e)=>{document.getElementById('timeFieldInput1').focus()}}></img>  </div></Col>           
           <Col style={{padding:'0px'}}>
           <div className='basicRec secNm' style={{marginBottom:'28px',padding:'11px 10px'}}>Total number of questions: <input type='number' style={{maxWidth:'60px', background: 'rgba(0,0,0,0)'}} 
           onChange={(e)=>{
               console.log(e.target.valueAsNumber);
               console.log(sid-1);
            console.log(Math.min(easy.length,med.length,hard.length))
            if(0<=e.target.valueAsNumber && (e.target.valueAsNumber<=(Math.min(easy.length,med.length,hard.length)||med.length>0?med.length:0))){
            if(sid-1===1){
                
                setCFDic({time:CurrentDic.time,totalQs:e.target.valueAsNumber})
            }else if(sid-1===2){
                setDDic({time:CurrentDic.time,totalQs:e.target.valueAsNumber})
            }
            else if(sid-1===3){setPDic({time:CurrentDic.time,totalQs:e.target.valueAsNumber})}
            else if(sid-1==4){setCDic({time:CurrentDic.time,totalQs:e.target.valueAsNumber})}
            else if(sid-1==5){setAWDic({time:CurrentDic.time,totalQs:e.target.valueAsNumber})}
            else if (sid-1===0){setAptDic({time:CurrentDic.time,totalQs:e.target.valueAsNumber})}
            setCurrentDic({time:CurrentDic.time,totalQs:e.target.valueAsNumber})
        }
            }} value={CurrentDic.totalQs}/></div>
           </Col>
           </Row>
          

            </div>
           
            <Row style={{float:'right'}}>
            <button style={{color:'white'}} className='btn scTest' onClick={(e)=>navigate('/admin/home')} >Back to Home page</button>  <button style={{color:'white'}} type='submit' className='btn scTest' >Savee</button>

           </Row>
           </form>
        </div>
        </Col>
            
            </Row>
    )
}

export default NewTest

