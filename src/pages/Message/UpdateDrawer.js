import  React, { Component } from 'react';
import {connect} from 'dva';
import { postImg } from '@/services/api';
import {timestampToTime} from '@/utils/utils';
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
import {
    Row,
    Col,
    Form,
    Input,
    message,
    Drawer,  Icon,
    Select,
    Upload,
    Modal
} from 'antd';



const CustomToolbar = () => (
    <div id="toolbar">
        <div>
            信息内容
        </div>
    </div>
);

@Form.create()
@connect(({ company, loading }) => ({
    message,
    loading: loading.models.message,
}))
class DrawereComponent extends Component{
    state={
        previewVisible: false,
        previewImage: '',
        fileList: [],
        editorHtml:""
    }

    handleChange = (value) => {
        this.setState({ editorHtml: value })
    }

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

    componentWillReceiveProps(nextProps) {
        this.setState({
            editorHtml: nextProps.detailData.content
        })
        if(nextProps.detailData.thumbImg!==undefined){
            let arr=[];
            for(let i=0;i<nextProps.detailData.thumbImg.length;i++){
                arr.push({
                    uid: i+'',
                    name: 'xxx.png',
                    status: 'done',
                    url: nextProps.detailData.thumbImg[i],
                })
            }
            this.setState({
                fileList: arr
            });
        };

    }


    render(){
        const { fileList,  previewVisible, previewImage, editorHtml } = this.state;
        const {
            detailData,
            form: { getFieldDecorator },
        } = this.props;
        return(
            <Drawer
                title="查看详情或编辑"
                width={720}
                onClose={this.props.onClose}
                visible={this.props.drawerVisible}
            >
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="标题">
                                {getFieldDecorator('title', {
                                    initialValue:detailData===undefined?'':detailData.title,
                                    rules: [{ required: true,message: '标题' }],
                                })(<Input disabled={true} placeholder="标题" />)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="类型">
                                {getFieldDecorator('type', {
                                    initialValue:detailData===undefined?'':detailData.type,
                                    rules: [{ required: true, message: '类型' }],
                                })(
                                    <Select disabled={true} placeholder="请选择文章类型">
                                        <Option value="官方发布">官方发布</Option>
                                        <Option value="贷款产品">贷款产品</Option>
                                        <Option value="同行转单">同行转单</Option>
                                        <Option value="同行交流">同行交流</Option>
                                        <Option value="经验分享">经验分享</Option>
                                        <Option value="约跑同行">约跑同行</Option>
                                        <Option value="招聘信息">招聘信息</Option>
                                    </Select>,
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="发布人">
                                <span>{detailData===undefined?'':detailData.username}</span>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="发布时间">
                                <span>{detailData===undefined?'':timestampToTime(Number(detailData.createTime))}</span>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <style>
                                {`.ql-editor{padding: 10px;min-height: 150px;}`}
                            </style>
                            <CustomToolbar />
                            <ReactQuill
                                value={detailData.content}
                                readOnly={true}
                                theme={"snow"} // pass false to use minimal theme
                            />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="文章配图">
                                <div>
                                    <Upload
                                        listType="picture-card"
                                        fileList={fileList}
                                        onPreview={this.handlePreview}
                                        accept="image/*"
                                    >
                                    </Upload>
                                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                        <img alt="example" style={{ width: '100%' }} src={previewImage}/>
                                    </Modal>
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        )
    }
}

export default DrawereComponent