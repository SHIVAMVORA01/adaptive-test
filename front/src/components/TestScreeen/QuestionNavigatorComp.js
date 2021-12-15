import React from 'react'
import {Col,Row} from 'react-bootstrap';


function QuestionNavigatorComp({attempted}) {
    return (
        <div>
            <Row>
                <Col >
                <div style={{textAlign:'center'}}>
                Question Navigator
                </div>
                </Col>
            </Row>
            {attempted.length === 0 && <p style={{textAlign:'center'}}>0 questions attempted</p>}
            {attempted.length !== 0 &&
            <Row>
                <Row style={{paddingTop:'20px'}}>
                    {attempted.map((x,index)=>{
                      return <Col key={index} md='4' sm='6'> <div style={{backgroundColor:x>0?'#39FF14':'red'}} className='navigatorBox'>{index+1}</div></Col>
                    })}
                </Row>
            </Row>
}
        </div>
    )
}

export default QuestionNavigatorComp
