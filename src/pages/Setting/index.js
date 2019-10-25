import React, { Component, Fragment } from 'react';
import styles from './style.less';
import { connect } from 'dva';
import { postImg } from '@/services/api'
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    Button,
    Divider,
    Drawer,
    Upload,
    Icon,
    Modal,
} from 'antd';

const { Option } = Select;
const FormItem = Form.Item;

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

@connect(({ setting_thb, loading }) => ({
    setting_thb,
    loading: loading.models.rule,
}))
@Form.create()
class Page extends Component {
    state = {
        formValues: {},
        selectedRows: [],
        visible: false,
        previewVisible: false,
        previewImage: '',
        fileList: [],
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = ({ fileList }) => this.setState({ fileList });

    componentDidMount() {
        let { dispatch } = this.props;
        dispatch({
            type: 'setting_thb/fetch',
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            fileList: [
                {
                    uid: '-1',
                    name: 'xxx.png',
                    status: 'done',
                    url: nextProps.setting_thb.ewmImg,
                },
            ],
        });
    }

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };
    onClose = () => {
        this.setState({
            visible: false,
        });
    };
    uploadButton = () => (
        <div>
            <Icon type="plus"/>
            <div className="ant-upload-text">Upload</div>
        </div>
    );

    handleSubmit = async () => {
        let { getFieldsValue } = this.props.form;
        let data =  getFieldsValue();
        if(this.state.fileList[0].url){
            data.ewmImg = this.state.fileList[0].url;
        }else{
            data.ewmImg = (await postImg({
                imgData:this.state.fileList[0].thumbUrl
            })).imgPath;
        }

        let { setting_thb, dispatch } = this.props;
        dispatch({
            type:'setting_thb/updateSys',
            payload:{
                updateData:data,
                id:setting_thb._id+''
            }
        })
        this.onClose();
    }

    render() {
        let { setting_thb } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { previewVisible, previewImage, fileList } = this.state;
        return (
            <Fragment>
                <Drawer
                    title="修改系统设置"
                    width={720}
                    placement="right"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.visible}
                >
                    <Form layout="vertical" hideRequiredMark>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="推荐奖励金币">
                                    {getFieldDecorator('recommendedAward', {
                                        initialValue: setting_thb.recommendedAward,
                                        rules: [{ required: true, message: '请设置推荐奖励金币' }],
                                    })(<Input placeholder="请设置推荐奖励金币"/>)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="发布信息奖励金币">
                                    {getFieldDecorator('releaseArt', {
                                        initialValue: setting_thb.releaseArt,
                                        rules: [{ required: true, message: '请设置发布信息奖励金币' }],
                                    })(
                                        <Input placeholder="请设置发布信息奖励金币"/>)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="VIP价格">
                                    {getFieldDecorator('VIPPrice', {
                                        initialValue: setting_thb.VIPPrice,
                                        rules: [{ required: true, message: '请设置VIP价格' }],
                                    })(
                                        <Input placeholder="请设置VIP价格"/>)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="签到奖励">
                                    {getFieldDecorator('signInReward', {
                                        initialValue: setting_thb.signInReward,
                                        rules: [{ required: true, message: '请设置签到奖励' }],
                                    })(
                                        <Input placeholder="请设置签到奖励"/>)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label="客服二维码图片">
                                    <div className="clearfix">
                                        <Upload
                                            listType="picture-card"
                                            fileList={fileList}
                                            onPreview={this.handlePreview}
                                            onChange={this.handleChange}
                                            accept="image/*"
                                        >
                                            {fileList.length >= 1 ? null : this.uploadButton()}
                                        </Upload>
                                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                            <img alt="example" style={{ width: '100%' }} src={previewImage}/>
                                        </Modal>
                                    </div>
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
                        <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                            取消
                        </Button>
                        <Button onClick={this.handleSubmit} type="primary">
                            提交
                        </Button>
                    </div>
                </Drawer>
                <Card bordered={true} className={styles.me_card}>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={12}>
                            <div className={styles.gutter_box}>推荐奖励金币</div>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <div className="gutter-box">{setting_thb.recommendedAward}</div>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <div className={styles.gutter_box}>发布信息奖励</div>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <div className="gutter-box">{setting_thb.releaseArt}</div>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <div className={styles.gutter_box}>VIP价格</div>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <div className="gutter-box">{setting_thb.VIPPrice}</div>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <div className={styles.gutter_box}>签到奖励</div>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <div className="gutter-box">{setting_thb.signInReward}</div>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <div className={styles.gutter_box}>客服二维码图片:</div>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <img className={styles.img_ewm} src={setting_thb.ewmImg}/>
                        </Col>
                        <Col className={styles.btn_wrap} span={24}><Button type="primary"
                                                                           onClick={this.showDrawer}>修改</Button></Col>
                    </Row>
                </Card>
            </Fragment>
        );
    }
}

export default Page;