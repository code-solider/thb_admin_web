import  React, { Component } from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {
    Row,
    Col,
    Form,
    Input,
    Select,
    Button,
    Drawer,
    DatePicker,
    message
} from 'antd';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
function onChange(date, dateString) {
    console.log(date, dateString);
}

@Form.create()
@connect(({ rule, loading }) => ({
    rule,
    loading: loading.models.rule,
}))
class DrawereComponent extends Component{
    handleSub = () => {
        let { getFieldsValue, resetFields } = this.props.form;
        let data =  getFieldsValue();
        if(data.cyTime){
            data.cyTime = new Date(data.cyTime).getTime()+'';
        }else{
            data.cyTime='';
        }
        if(data.VIPEndTime){
            if(new Date(data.VIPEndTime).getTime()<Date.now()){
                message.error('选择的时间必须大于当前时间',1.5)
                return;
            }
            data.VIPEndTime = new Date(data.VIPEndTime).getTime()+'';
            data.isVIP = true;
        }else{
            data.VIPEndTime='';
            data.isVIP = false;
        }
        data.age = Number(data.age);
        data.sex = Number(data.sex);
        data.state = Number(data.state);
        let { dispatch } = this.props;
        dispatch({
            type:'rule/updateUserById',
            payload:{
                id:this.props.userById._id+'',
                where:data
            },
            callback:()=>{
                message.success('更新成功');
                this.props.onClose();
                resetFields();
            }
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        let {userById} = this.props;
        return(
            <Drawer
                title="更新用户信息"
                width={720}
                onClose={this.props.onClose}
                visible={this.props.drawerVisible}
            >
                <Form layout="vertical" hideRequiredMark>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="真实姓名">
                                {getFieldDecorator('realName',{
                                    initialValue: userById.realName,
                                })(<Input placeholder="请填写姓名" />)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="年龄">
                                {getFieldDecorator('age',{
                                    initialValue: userById.age,
                                })(<Input placeholder="请填写年龄" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="电话">
                                {getFieldDecorator('tel',{
                                    initialValue: userById.tel,
                                })(
                                    <Input placeholder="电话" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="性别">
                                {getFieldDecorator('sex', {
                                    initialValue: userById.sex+'',
                                    rules: [{ required: true, message: '请选择性别' }],
                                })(
                                    <Select placeholder="选择性别">
                                        <Option value="1">男</Option>
                                        <Option value="2">女</Option>
                                    </Select>,
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="入行时间">
                                {getFieldDecorator('cyTime', {
                                    initialValue:userById.cyTime!==''?moment(new Date(parseInt(userById.cyTime)), dateFormat):'',
                                })(
                                    <DatePicker  format={dateFormat} onChange={onChange} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="状态">
                                {getFieldDecorator('state', {
                                    initialValue: userById.state+'',
                                    rules: [{ required: true, message: '请选择状态' }],
                                })(
                                    <Select placeholder="选择性别">
                                        <Option value="0">冻结</Option>
                                        <Option value="1">正常</Option>
                                    </Select>,
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="会员到期时间">
                                {getFieldDecorator('VIPEndTime', {
                                    initialValue:userById.VIPEndTime!==''?moment(new Date(parseInt(userById.VIPEndTime)), dateFormat):'',
                                })(
                                    <DatePicker  format={dateFormat} onChange={onChange} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="公司">
                                <span>{userById===undefined?'':userById.companyName}</span>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="简介">
                                {getFieldDecorator('info', {
                                    initialValue: userById.info,
                                })(<Input.TextArea rows={4} placeholder="输入简介" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        width: '100%',
                        borderTop: '1px solid #e9e9e9',
                        padding: '10px 16px',
                        background: '#fff',
                        textAlign: 'right',
                    }}
                >
                    <Button onClick={this.props.onClose} style={{ marginRight: 8 }}>
                        取消
                    </Button>
                    <Button onClick={this.handleSub} type="primary">
                        提交
                    </Button>
                </div>
            </Drawer>
        )
    }
}

export default DrawereComponent