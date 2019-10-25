import React, { Component, Fragment } from 'react';
import styles from './style.less';
import { connect } from 'dva';
import StandardTable from '@/components/StandardTable';
import {timestampToTime} from '@/utils/utils'
import {
    Row,
    Col,
    Card,
    Form,
    Select,
    Button
} from 'antd';

const FormItem = Form.Item;

@connect(({ order, loading }) => ({
    order,
    loading: loading.models.rule,
}))
@Form.create()
class Page extends Component {
    state = {
        formValues: {},
        selectedRows: [],
    };

    componentDidMount() {
        let { dispatch } = this.props;
        dispatch({
            type:'order/fetch',
            payload:{
                where:{
                    paymentStatus:2
                },
                page:1,
                size:20
            }
        })
    }

    columns = [
        {
            title: '用户名',
            dataIndex: 'userRealName',
            key: 'userRealName'
        },
        {
            title: '描述订单',
            dataIndex: 'desc',
            key: 'desc',
        },
        {
            title: '购买数量',
            dataIndex: 'buyNum',
            key: 'buyNum'
        },
        {
            title: '购买单价',
            dataIndex: 'buyPrice',
            key: 'buyPrice',
        },
        {
            title: '购买总价',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
        },
        {
            title: '支付状态',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            render(val) {
                return val === 2? '已支付' : '未支付';
            },
        },
        {
            title: '订单创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render(val) {
                return timestampToTime(Number(val))
            },
        },
    ];

    handleSearch = e => {
        e.preventDefault();
        let { getFieldsValue } = this.props.form;
        let data = getFieldsValue();
        const { dispatch } = this.props;
        dispatch({
            type:'order/fetch',
            payload:{
                where:data,
                page:1,
                size:20
            }
        })
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

    renderSimpleForm() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={6} sm={24}>
                        <FormItem label="订单状态">
                            {getFieldDecorator('paymentStatus')(
                                <Select placeholder="请选择" style={{ width: '100%' }}>
                                    <Option value={1}>未支付</Option>
                                    <Option value={2}>已支付</Option>
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
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    render() {
        const { loading, order } = this.props;
        const { selectedRows } = this.state;
        return (
            <Card bordered={false} className={styles.me_card}>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                        <StandardTable
                            selectedRows={selectedRows}
                            loading={loading}
                            data={order}
                            columns={this.columns}
                            onSelectRow={this.handleSelectRows}
                            onChange={this.handleStandardTableChange}
                        />
                    </div>
                </Card>
            </Card>
        );
    }
}

export default Page;