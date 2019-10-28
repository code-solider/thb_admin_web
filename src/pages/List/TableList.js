import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { timestampToTime } from '@/utils/utils';
import DrawereComponent from './Drawer';
import { CSVLink, CSVDownload } from 'react-csv';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  message,
  Divider,
  Tag,
  Popconfirm,
  Drawer,
  DatePicker,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';

import styles from './TableList.less';

const FormItem = Form.Item;
const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
function onChange(date, dateString) {
  console.log(date, dateString);
}

const CreateForm = Form.create();

/* eslint react/no-multi-comp:0 */
@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    where: { regTime: { $ne: '' } },
    drawerVisible: false,
    csvData: [],
  };

  showDrawer = () => {
    this.setState({
      drawerVisible: true,
    });
  };

  onClose = () => {
    this.setState({
      drawerVisible: false,
    });
  };

  columns = [
    {
      title: '注册时间',
      dataIndex: 'regTime',
      key: 'regTime',
      render(val) {
        return val !== '' ? timestampToTime(Number(val)) : '';
      },
    },
    {
      title: '同行姓名',
      dataIndex: 'realName',
      key: 'realName',
      render(val) {
        return val === '' ? '' : val;
      },
    },
    {
      title: '同行电话',
      dataIndex: 'tel',
      key: 'tel',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      render(val) {
        return val === 1 ? '男' : '女';
      },
    },
    {
      title: '公司名称',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: '公司业务',
      dataIndex: 'gsyw',
      key: 'gsyw',
      render(val) {
        return val.join('，');
      },
    },
    {
      title: '被同行关注量',
      dataIndex: 'gzNumber',
      key: 'gzNumber',
    },
    {
      title: '金币',
      dataIndex: 'intergral',
      key: 'intergral',
    },
    {
      title: '钱包',
      dataIndex: 'money',
      key: 'money',
    },
    {
      title: '会员',
      dataIndex: 'isVIP',
      key: 'isVIP',
      render(val) {
        return val === true ? <Tag color="green">是</Tag> : <Tag color="magenta">否</Tag>;
      },
    },

    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render(val) {
        return val === 0 ? <Tag color="magenta">冻结</Tag> : <Tag color="green">正常</Tag>;
      },
    },
    {
      title: '操作',
      dataIndex: '_id',
      key: '_id',
      render: text => <a onClick={() => this.handleGetUserById(text)}>编辑</a>,
    },
  ];

  handleGetUserById = id => {
    this.showDrawer();
    let { dispatch } = this.props;
    dispatch({
      type: 'rule/getOneUserById',
      payload: id,
    });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
      payload: {
        where: this.state.where,
        page: 1,
        size: 20,
      },
    });

    dispatch({
      type: 'rule/downData',
      payload: {
        where: {},
        page: 1,
        size: 20000,
      },
      callback: e => {
        let csvData = [['同行姓名', '同行电话', '年龄', '性别', '公司名称', '公司业务', '会员']];

        let arr = [];
        for (let i = 0; i < e.length - 1; i++) {
          arr = [];
          arr.push(
            e[i].realName,
            e[i].tel,
            e[i].age,
            e[i].sex === 1 ? '男' : '女',
            e[i].companyName,
            e[i].gsyw,
            e[i].isVIP === true ? '是' : '否'
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

  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
      payload: {
        where: this.state.where,
        page: pagination.current,
        size: pagination.pageSize,
      },
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields(async (err, fieldsValue) => {
      if (err) return;
      await this.setState({
        where: {
          realName: fieldsValue.realName,
          state: fieldsValue.state === undefined ? undefined : parseInt(fieldsValue.state),
          isVIP: fieldsValue.isVIP,
          regTime:
            fieldsValue.regTime === undefined
              ? undefined
              : Number(fieldsValue.regTime) === 1
              ? { $ne: '' }
              : '',
        },
      });
      let data = {
        where: {
          realName: fieldsValue.realName,
          state: fieldsValue.state === undefined ? undefined : parseInt(fieldsValue.state),
          isVIP: fieldsValue.isVIP,
          regTime:
            fieldsValue.regTime === undefined
              ? undefined
              : Number(fieldsValue.regTime) === 1
              ? { $ne: '' }
              : '',
        },
        page: 1,
        size: 20,
      };
      dispatch({
        type: 'rule/fetch',
        payload: data,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'rule/update',
      payload: {
        query: formValues,
        body: {
          name: fields.name,
          desc: fields.desc,
          key: fields.key,
        },
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('realName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="用户状态">
              {getFieldDecorator('state')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">冻结</Option>
                  <Option value="1">正常</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="是否会员">
              {getFieldDecorator('isVIP')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value={true}>是</Option>
                  <Option value={false}>否</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="是否完善">
              {getFieldDecorator('regTime')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">已完善</Option>
                  <Option value="0">未完善</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
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
          <Col>
            <CSVLink data={this.state.csvData} filename={'同行数据.csv'}>
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
    const {
      rule: { data, userById },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      stepFormValues,
      drawerVisible,
    } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <PageHeaderWrapper title="用户列表">
        <DrawereComponent
          drawerVisible={drawerVisible}
          userById={userById}
          onClose={this.onClose}
        />
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
