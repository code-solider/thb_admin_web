import React, { Component, Fragment } from 'react';
import styles from './style.less';
import { connect } from 'dva';
import StandardTable from '@/components/StandardTable';
import AddCompanyDrawer from './AddCompanyDrawer';
import UpdateCompanyDrawer from './UpdateCompanyDrawer';
import { timestampToTime } from '@/utils/utils';
import { CSVLink, CSVDownload } from 'react-csv';
import { Row, Col, Card, Form, Input, Button, Divider, message, Popconfirm } from 'antd';

const FormItem = Form.Item;

@connect(({ company, loading }) => ({
  company,
  loading: loading.models.company,
}))
@Form.create()
class Page extends Component {
  state = {
    formValues: {},
    selectedRows: [],
    addCompanyVisible: false,
    updateCompanyVisible: false,
    visible: false,
    csvData: [],
  };

  showDrawer = (e, e2) => {
    if (e === 'addCompanyVisible') {
      this.setState({
        addCompanyVisible: true,
      });
    } else if (e === 'updateCompanyVisible') {
      this.setState({
        updateCompanyVisible: true,
      });
    }
    if (e2) {
      let { dispatch } = this.props;
      dispatch({
        type: 'company/fetchCompanyDetailById',
        payload: e2,
      });
    }
  };

  onClose = e => {
    if (e === 'addCompanyVisible') {
      this.setState({
        addCompanyVisible: false,
      });
    } else if (e === 'updateCompanyVisible') {
      this.setState({
        updateCompanyVisible: false,
      });
    }
  };

  componentDidMount() {
    let { dispatch } = this.props;
    dispatch({
      type: 'company/fetch',
      payload: {
        where: {},
        page: 1,
        size: 20,
      },
    });
    dispatch({
      type: 'company/downData',
      payload: {
        where: {},
        page: 1,
        size: 20000,
      },
      callback: e => {
        let csvData = [['添加人姓名', '添加人电话', '公司名称', '公司业务', '区域', '地址']];

        let arr = [];
        for (let i = 0; i < e.length - 1; i++) {
          arr = [];
          arr.push(
            e[i].lxrName,
            e[i].lxrTel,
            e[i].shortName,
            e[i].yewu,
            e[i].addressQuyu,
            e[i].address
          );
          csvData.push(arr);
        }

        this.setState(
          {
            csvData,
          },
          () => {
            // console.log(csvData);
          }
        );
      },
    });
  }

  handleDelete = e => {
    let { dispatch } = this.props;
    dispatch({
      type: 'company/delCompanyById',
      payload: e,
      callback: e => {
        message.success(e.message, 1.5);
      },
    });
  };

  columns = [
    {
      title: '添加时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render(val) {
        return timestampToTime(Number(val));
      },
    },
    {
      title: '添加人姓名',
      dataIndex: 'lxrName',
      key: 'lxrName',
    },
    {
      title: '添加人电话',
      dataIndex: 'lxrTel',
      key: 'lxrTel',
    },
    {
      title: '公司LOGO',
      dataIndex: 'companyLogo',
      key: 'companyLogo',
      render(val) {
        return <img style={{ width: '70px', height: '70px' }} src={val} />;
      },
    },
    {
      title: '公司名称',
      dataIndex: 'shortName',
      key: 'shortName',
    },
    {
      title: '公司业务',
      dataIndex: 'yewu',
      key: 'yewu',
      render(val) {
        return val.join('，');
      },
    },
    {
      title: '区域',
      dataIndex: 'addressQuyu',
      key: 'addressQuyu',
      render(val) {
        return val.join('----');
      },
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '关注人数',
      dataIndex: 'gzNumber',
      key: 'gzNumber',
    },
    {
      title: '操作',
      dataIndex: '_id',
      key: '_id',
      render: text => (
        <Fragment>
          <a onClick={() => this.showDrawer('updateCompanyVisible', text)}>编辑</a>
          <Divider type={'vertical'} />
          <Popconfirm title="确认删除?" onConfirm={() => this.handleDelete(text)}>
            <a href="javascript:void(0);">删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'company/fetch',
      payload: {
        where: {},
        page: 1,
        size: 20,
      },
    });
  };

  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/fetch',
      payload: {
        where: this.state.where,
        page: pagination.current,
        size: pagination.pageSize,
      },
    });
  };

  handleSubmitSearch = () => {
    let { getFieldsValue } = this.props.form;
    let data = getFieldsValue();
    const { dispatch } = this.props;
    this.setState({
      where: {
        $or: [
          { companyName: { $regex: data.shortName, $options: 'i' } },
          { shortName: { $regex: data.shortName, $options: 'i' } },
          { yewu: { $regex: data.shortName, $options: 'i' } },
          { addressQuyu: { $regex: data.shortName, $options: 'i' } },
          { address: { $regex: data.shortName, $options: 'i' } },
        ],
      },
    });
    dispatch({
      type: 'company/fetch',
      payload: {
        where: {
          $or: [
            { companyName: { $regex: data.shortName, $options: 'i' } },
            { shortName: { $regex: data.shortName, $options: 'i' } },
            { yewu: { $regex: data.shortName, $options: 'i' } },
            { addressQuyu: { $regex: data.shortName, $options: 'i' } },
            { address: { $regex: data.shortName, $options: 'i' } },
          ],
        },
        page: 1,
        size: 20,
      },
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="关键字搜索">
              {getFieldDecorator('shortName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button onClick={this.handleSubmitSearch} type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
          <Col style={{ textAlign: 'right' }}>
            <Button onClick={() => this.showDrawer('addCompanyVisible')} type="primary">
              新增公司
            </Button>

            <CSVLink data={this.state.csvData} filename={'公司数据.csv'}>
              <Button type="danger" style={{ marginLeft: 8 }} icon="download">
                下载数据到本地
              </Button>
            </CSVLink>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { loading, company } = this.props;
    const { selectedRows, addCompanyVisible, updateCompanyVisible } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Fragment>
        <AddCompanyDrawer drawerVisible={addCompanyVisible} onClose={this.onClose} />
        <UpdateCompanyDrawer drawerVisible={updateCompanyVisible} onClose={this.onClose} />
        <Card bordered={false} className={styles.me_card}>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={company}
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
