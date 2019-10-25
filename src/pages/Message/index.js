import React, { Component, Fragment } from 'react';
import styles from './style.less';
import { connect } from 'dva';
import StandardTable from '@/components/StandardTable';
import {timestampToTime} from '@/utils/utils';
import DrawereComponent from './UpdateDrawer'
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    Button,
    Popconfirm,
    message,
    Divider,
} from 'antd';

const FormItem = Form.Item;

@connect(({ message, loading }) => ({
    message,
    loading: loading.models.message,
}))
@Form.create()
class Page extends Component {
    state = {
        formValues: {},
        selectedRows: [],
        visible: false,
        detailData:{}
    };

    showDrawer = (e) => {
        let {dispatch} = this.props;
        dispatch({
            type:'message/getDetailById',
            payload:e
        })
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };


    componentDidMount() {
        let { dispatch } = this.props;
        dispatch({
            type:'message/fetch',
            payload:{
                where:{

                },
                page:1,
                size:20
            }
        })
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            detailData:nextProps.message.detailData
        })
    }

    columns = [
        {
            title: '发布时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render(val) {
                return timestampToTime(Number(val))
            },
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '文章类型',
            dataIndex: 'type',
            key: 'type'
        },
        {
            title: '发布用户',
            dataIndex: 'username',
            key: 'username'
        },
        {
            title: '点赞量',
            dataIndex: 'dzNumber',
            key: 'dzNumber',
        },
        {
            title: '被赞赏',
            dataIndex: 'profit',
            key: 'profit',
        },
        {
            title: '评论量',
            dataIndex: 'plNumber',
            key: 'plNumber',
        },
        {
            title: '操作',
            dataIndex: '_id',
            key:'_id',
            render: (text) => (
                <Fragment>
                    <a onClick={()=>this.showDrawer(text)}>查看详情</a>
                    <Divider type={'vertical'}/>
                    <Popconfirm title="确认删除?" onConfirm={() => this.handleDelete(text)}>
                        <a href="">删除</a>
                    </Popconfirm>
                </Fragment>
            ),
        },
    ];

    handleDelete = (e) => {
        let { dispatch } = this.props;
        dispatch({
            type: 'message/delArtById',
            payload: e,
            callback: (e) => {
                message.success(e.message, 1.5);
            },
        });
    }

    handleSearch = e => {
        e.preventDefault();
        let { getFieldsValue } = this.props.form;
        let data = getFieldsValue();
        const { dispatch } = this.props;
        dispatch({
            type: 'message/fetch',
            payload: {
                where: data,
                page: 1,
                size: 20,
            },
        });
    };

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        dispatch({
            type: 'rule/fetch',
            payload: {},
        });
    };

    handleStandardTableChange = (pagination) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'message/fetch',
            payload: {
                where:{},
                page: pagination.current,
                size: pagination.pageSize,
            },
        });
    };

    renderSimpleForm() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={6} sm={24}>
                        <FormItem label="发布用户">
                            {getFieldDecorator('username')(<Input placeholder="请输入"/>)}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24} className={styles.me_col}>
                        <FormItem label="文章类型">
                            {getFieldDecorator('type')(
                                <Select placeholder="请选择" style={{ width: '100%' }}>
                                    <Option value="贷款产品">贷款产品</Option>
                                    <Option value="同行转单">同行转单</Option>
                                    <Option value="同行交流">同行交流</Option>
                                    <Option value="经验分享">经验分享</Option>
                                    <Option value="约跑同行">约跑同行</Option>
                                    <Option value="招聘信息">招聘信息</Option>
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <span className={styles.submitButtons}>
                          <Button type="primary" htmlType="submit">
                            查询
                          </Button>
                          <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                            重置
                          </Button>
                            {/*<Button type={'dashed'} style={{ marginLeft: 8 }} onClick={this.handleFormReset}>*/}
                            {/*发布文章*/}
                          {/*</Button>*/}
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    render() {
        const { loading, message } = this.props;
        const { selectedRows, visible, detailData } = this.state;

        return (
            <Fragment>
                <DrawereComponent
                    drawerVisible={visible}
                    onClose={this.onClose}
                    detailData={detailData}
                />
                <Card bordered={false} className={styles.me_card}>
                    <Card bordered={false}>
                        <div className={styles.tableList}>
                            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                            <StandardTable
                                selectedRows={selectedRows}
                                loading={loading}
                                data={message}
                                columns={this.columns}
                                onSelectRow={this.handleSelectRows}
                                onChange={this.handleStandardTableChange}
                            />
                        </div>
                    </Card>
                </Card>
            </Fragment>
        );
    }
}

export default Page;