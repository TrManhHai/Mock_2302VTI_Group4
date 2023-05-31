import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";
import { getListGroupAction, updateSelectedRowsAction } from '../../redux/actions/groupActions';
import { connect } from "react-redux";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from 'react-bootstrap-table2-paginator';
import { selectListGroup, selectPage, selectSelectedRows, selectSize, selectSortField, selectSortType, selectTotalElement } from '../../redux/selectors/groupSelector';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import filterFactory, { customFilter } from 'react-bootstrap-table2-filter';
import CustomSearch from './CustomSearch';
import * as Icon from "react-feather";
import Filter from "./CustomFilter";
import { ReactstrapInput } from "reactstrap-formik";
import GroupApi from '../../api/GroupApi';
import { Formik, FastField, Form } from 'formik';
import * as Yup from 'yup';
import { toastr } from "react-redux-toastr";
import { Edit2 } from "react-feather";

const Group = (props) => {

  const getListGroups = props.getListGroupAction;
  const size = props.size;

  // filter
  const [isVisibleFilter, setVisibleFilter] = useState(false);
  let onTotalMemberFilter;

  useEffect(() => {
    getListGroups(1, size);
  }, [getListGroups, size]);

  const actionFormatter = (cell, row, rowIndex) => {
    return (
      <Edit2 className="align-middle mr-1" size={18} onClick={() => updateGroup(row.id)} />
    );
  };

  const tableColumns = [
    {
      dataField: "name",
      text: "Name",
      sort: true
    },
    {
      dataField: "totalMember",
      text: "Total Member",
      sort: true,
      filter: customFilter(),
      filterRenderer: (onFilter, column) => {
        onTotalMemberFilter = onFilter;
        return null;
      }
    },
    {
      dataField: "actions",
      text: "",
      align: () => {
        return 'center';
      },
      headerStyle: () => {
        return { width: '80px' };
      },
      formatter: actionFormatter
    }
  ];

  const handleTableChange = (type, { page, sizePerPage, sortField, sortOrder, searchText, filters }) => {
    const filter = filters && filters.totalMember && filters.totalMember.filterVal ? filters.totalMember.filterVal : null;
    const minTotalMember = filter && filter.minTotalMember ? filter.minTotalMember : null;
    const maxTotalMember = filter && filter.maxTotalMember ? filter.maxTotalMember : null;
    getListGroups(page, sizePerPage, sortField, sortOrder, searchText, minTotalMember, maxTotalMember);
  }

  const onFilterChange = (minTotalMember, maxTotalMember) => {
    onTotalMemberFilter({
      minTotalMember,
      maxTotalMember
    });
  }

  const refreshForm = () => {
    handleTableChange(
      null,
      {
        page: 1,
        sizePerPage: size,
        sortField: null,
        sortOrder: null,
        searchText: "",
        filters: {
          totalMember: null
        }
      }
    );
    // refresh selected rows
    props.updateSelectedRowsAction([]);
  }

  // create
  const [isOpenModalCreate, setOpenModalCreate] = useState(false);

  const showSuccessNotification = (title, message) => {
    const options = {
      timeOut: 2500,
      showCloseButton: false,
      progressBar: false,
      position: "top-right"
    };

    // show notification
    toastr.success(title, message, options);
  }

  const showWrongNotification = (title, message) => {
    const options = {
      timeOut: 2500,
      showCloseButton: false,
      progressBar: false,
      position: "top-right"
    };

    // show notification
    toastr.error(title, message, options);
  }

  const [isOpenModalUpdate, setOpenModalUpdate] = useState(false);
  const [updateGroupInfo, setUpdateGroupInfo] = useState();

  // update
  const updateGroup = async (groupId) => {
    const groupInfo = await GroupApi.getByID(groupId);
    setUpdateGroupInfo(groupInfo);
    setOpenModalUpdate(true);
  }

  // delete 
  const deleteGroups = async () => {
    if (props.selectedRows === null || props.selectedRows === undefined || props.selectedRows.length === 0) {
      showWrongNotification(
        "Delete Group",
        "You have not selected group!"
      );
    } else {
      await GroupApi.deleteByIds(props.selectedRows);
      // show notification
      showSuccessNotification(
        "Delete Group",
        "Delete Group Successfully!");
      // reload group page
      refreshForm();
    }
  }

  const handleOnSelect = (row, isSelect) => {
    let selected = props.selectedRows;
    if (isSelect) {
      selected = [...selected, row.id]
    } else {
      selected = selected.filter(x => x !== row.id)
    }
    props.updateSelectedRowsAction(selected);
  }

  const handleOnSelectAll = (isSelect, rows) => {
    const ids = rows.map(r => r.id);
    let selected = [];

    if (isSelect) {
      selected = ids;
    }

    props.updateSelectedRowsAction(selected);
  }

  return (
    <Container fluid className="p-0">
      <h1 className="h3 mb-3">Group Management</h1>
      <Card>
        <ToolkitProvider
          keyField="id"
          data={props.groups}
          columns={tableColumns}
          search
        >
          {
            toolkitprops => (
              <div>
                <CardBody>
                  <Row>
                    <Col>
                      {isVisibleFilter && <Filter onFilterChange={onFilterChange} />}
                    </Col>
                  </Row>
                  <Row style={{ alignItems: "flex-end" }}>
                    <Col xs="9">
                      <CustomSearch {...toolkitprops.searchProps} />
                    </Col>
                    <Col xs="3" style={{ paddingBottom: 20 }}>
                      <div className="float-right pull-right">
                        {/* filter button */}
                        <Icon.Filter size="24" className="align-middle mr-2" onClick={() => setVisibleFilter(!isVisibleFilter)} />
                        <Icon.RefreshCcw size="24" className="align-middle mr-2" onClick={() => refreshForm()} />
                        <Icon.PlusCircle size="24" className="align-middle mr-2" onClick={() => setOpenModalCreate(true)} />
                        <Icon.Trash2 size="24" className="align-middle mr-2" onClick={deleteGroups} />
                      </div>
                    </Col>
                  </Row>
                  <BootstrapTable
                    {...toolkitprops.baseProps}
                    bootstrap4
                    striped
                    hover
                    bordered
                    remote
                    sort={{
                      dataField: props.sortField,
                      order: props.sortType
                    }}
                    pagination={paginationFactory({
                      page: props.page,
                      totalSize: props.totalElement,
                      sizePerPage: props.size,

                      nextPageText: '>',
                      prePageText: '<',
                      withFirstAndLast: false,
                      alwaysShowAllBtns: true,

                      hideSizePerPage: true,

                    })}
                    filter={filterFactory()}
                    selectRow={{
                      mode: 'checkbox',
                      clickToSelect: true,
                      selected: props.selectedRows,
                      onSelect: handleOnSelect,
                      onSelectAll: handleOnSelectAll
                    }}
                    onTableChange={handleTableChange}
                  />
                </CardBody>
              </div>
            )
          }
        </ToolkitProvider>

      </Card>

      {/* model create */}
      <Modal
        isOpen={isOpenModalCreate}
      >
        <Formik
          initialValues={
            {
              name: ''
            }
          }
          validationSchema={
            Yup.object({
              name: Yup.string()
                .required('Required')
                .max(50, 'Must be between 6 to 50 characters')
                .min(6, 'Must be between 6 to 50 characters')
                .test('checkUniqueName', 'This name is already exists.', async name => {
                  // call api
                  const isExists = await GroupApi.existsByName(name);
                  return !isExists;
                })
            })
          }
          onSubmit={
            async (values) => {
              try {
                // call api
                await GroupApi.create(values.name);
                setOpenModalCreate(false);
                // show notification
                showSuccessNotification(
                  "Create Group",
                  "Create Group Successfully!");
                // reload group page
                refreshForm();

              } catch (error) {
                console.log(error);
                setOpenModalCreate(false);
              }
            }
          }
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* header */}
              <ModalHeader>
                Create Group
              </ModalHeader>

              {/* body */}
              <ModalBody className="m-3">

                {/* Name */}
                <Row style={{ alignItems: "center" }}>
                  <Col xs="auto">
                    Group Name:
                    </Col>
                  <Col>
                    <FastField
                      bsSize="lg"
                      type="text"
                      name="name"
                      placeholder="Enter Group Name"
                      component={ReactstrapInput}
                    />
                  </Col>
                </Row>
              </ModalBody>

              {/* footer */}
              <ModalFooter>
                {/* resend */}
                <Button
                  color="primary"
                  style={{ marginLeft: 10 }}
                  disabled={isSubmitting}
                  type="submit"
                >
                  Save
                </Button>

                {/* close button */}
                <Button
                  color="primary"
                  onClick={() => setOpenModalCreate(false)}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* model update */}
      <Modal
        isOpen={isOpenModalUpdate}
      >
        <Formik
          initialValues={
            {
              name: updateGroupInfo ? updateGroupInfo.name : '',
              totalMember: updateGroupInfo ? updateGroupInfo.totalMember : ''
            }
          }
          validationSchema={
            Yup.object({
              name: Yup.string()
                .required('Required')
                .max(50, 'Must be between 6 to 50 characters')
                .min(6, 'Must be between 6 to 50 characters')
                .test('checkUniqueName', 'This name is already exists.', async name => {
                  if (name === updateGroupInfo.name) {
                    return true;
                  }

                  // call api
                  const isExists = await GroupApi.existsByName(name);
                  return !isExists;
                }),
              totalMember: Yup.number()
                .min(0, "Must be a positive integer")
                .integer("Must be a positive integer"),
            })
          }
          onSubmit={
            async (values) => {
              try {
                // call api
                await GroupApi.update(updateGroupInfo.id, values.name, values.totalMember);
                setOpenModalUpdate(false);
                // show notification
                showSuccessNotification(
                  "Update Group",
                  "Update Group Successfully!");
                // reload group page
                refreshForm();

              } catch (error) {
                console.log(error);
                setOpenModalUpdate(false);
              }
            }
          }
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* header */}
              <ModalHeader>
                Update Group
              </ModalHeader>

              {/* body */}
              <ModalBody className="m-3">

                {/* Name */}
                <Row style={{ alignItems: "center" }}>
                  <Col xs="auto">
                    Group Name:
                    </Col>
                  <Col>
                    <FastField
                      bsSize="lg"
                      type="text"
                      name="name"
                      placeholder="Enter Group Name"
                      component={ReactstrapInput}
                    />
                  </Col>
                </Row>

                {/* Total Member */}
                <Row style={{ alignItems: "center" }}>
                  <Col xs="auto">
                    Total Member:
                    </Col>
                  <Col>
                    <FastField
                      bsSize="lg"
                      type="number"
                      name="totalMember"
                      placeholder="Enter Total Member"
                      component={ReactstrapInput}
                    />
                  </Col>
                </Row>
              </ModalBody>

              {/* footer */}
              <ModalFooter>
                {/* resend */}
                <Button
                  color="primary"
                  style={{ marginLeft: 10 }}
                  disabled={isSubmitting}
                  type="submit"
                >
                  Save
                </Button>

                {/* close button */}
                <Button
                  color="primary"
                  onClick={() => setOpenModalUpdate(false)}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>

    </Container >
  )
};

const mapGlobalStateToProps = state => {
  return {
    groups: selectListGroup(state),
    page: selectPage(state),
    size: selectSize(state),
    totalElement: selectTotalElement(state),
    sortField: selectSortField(state),
    sortType: selectSortType(state),
    selectedRows: selectSelectedRows(state)
  };
};

export default connect(mapGlobalStateToProps, { getListGroupAction, updateSelectedRowsAction })(Group);