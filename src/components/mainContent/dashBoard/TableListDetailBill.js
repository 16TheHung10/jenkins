import BaseComponent from 'components/BaseComponent';
import Paging from "external/control/pagination";
import DateHelper from 'helpers/DateHelper';
import StringHelper from 'helpers/StringHelper';
import $ from "jquery";
import React, { Fragment } from 'react';

export default class TableListDetailBill extends BaseComponent {
	constructor(props) {
		super(props)

		this.idComponent = "list" + StringHelper.randomKey();

		this.objItems = {};

		this.isRender = true;
	}

	handleClickPaging = (page) => {
		// this.props.page = page;
		// this.refresh();
		this.props.updateFilter(page, 'pageDetail');
	}

	componentDidMount() {
		this.handleRightClick(this.idComponent);
	}

	handleHighlight = (qty) => {
		if (qty < 0) {
			return "cl-red";
		}
		return "";
	}

	handleExpandItems = (e) => {
		if ($(e.target).hasClass('active')) {
			$('.tb-child-items').addClass('d-none');
			$('.btn-expand-tr-items').text("+");
			$('.btn-expand-tr-items').removeClass('active');
			return false;
		}

		$('.tb-child-items').addClass('d-none');
		$('.btn-expand-tr-items').text("+");
		$('.btn-expand-tr-items').removeClass('active');

		$(e.target).parents('.tb-parent').next('.tb-child-items').removeClass('d-none');
		$(e.target).text("-")
		$(e.target).addClass('active');
	}

	handleExpandPayment = (e) => {
		if ($(e.target).hasClass('active')) {
			$('.tb-child-payment').addClass('d-none');
			$('.btn-expand-tr-payment').text("+");
			$('.btn-expand-tr-payment').removeClass('active');
			return false;
		}

		$('.tb-child-payment').addClass('d-none');
		$('.btn-expand-tr-payment').text("+");
		$('.btn-expand-tr-payment').removeClass('active');

		$(e.target).parents('.tb-parent').next().next('.tb-child-payment').removeClass('d-none');
		$(e.target).text("-")
		$(e.target).addClass('active');
	}

	// renderContextMenuBill = () => {
	// 	return (
	//         <div className="context menu">
	//             <ul className="menu-options">
	// 				<li className="menu-option" onClick={ (e) => this.props.checkBill($(this.getCurrentTarget()).attr('data-itemid')) }>
	// 					<i><FontAwesomeIcon icon={faCheck}/></i>Bill detail</li>
	//             </ul>
	//         </div>
	//     )
	// }

	handleItemShowDetail = (objGroupDetail) => {
		if (Object.keys(objGroupDetail).length === 0) {
			return false;
		}

		let obj = {};

		let min = (this.props.page - 1) * 30;
		let max = this.props.page * 30;

		for (let i = min; i < max; i++) {
			let key = Object.keys(objGroupDetail)[i];
			if (key) {
				obj[key] = objGroupDetail[key];
			}
		}

		return obj;
	}

	renderComp = () => {
		let items = Object.values(this.props.objItems).sort((a, b) => new Date(a.invoiceDate) - new Date(b.invoiceDate));
		let objItems = this.handleItemShowDetail(items);

		return (
			<section id={this.idComponent}>
				{
					Object.keys(items).length > 0 ?
						<div className="text-right">
							<div style={{ display: 'inline-block' }}>
								<Paging page={this.props.page} onClickPaging={this.handleClickPaging} onClickSearch={() => console.log()} itemCount={Object.keys(items).length} />
							</div>
						</div> : ""
				}
				<div style={{ maxHeight: 'calc(100vh - 230px)', overflowY: 'auto', position: 'relative' }}>
					<table className="table" >
						<thead style={{ position: 'sticky', top: 0 }}>
							<tr>
								<th className='fs-10'>Invoice code</th>
								<th className="fs-10 rule-date">Time</th>
								<th className="fs-10 text-center">Cash <br />received</th>
								<th className="fs-10 text-center">Return <br />amount</th>
								<th className="fs-10 text-center">Total <br />amount</th>
								<th className="fs-10 text-center">Discount <br />amount</th>
								<th className="fs-10 text-center">Gross <br />sales</th>
								<th className='fs-10'>Employee</th>
								<th className='fs-10'></th>
								<th className='fs-10'>Detail</th>
							</tr>
						</thead>
						<tbody>
							{
								Object.keys(objItems).length > 0 &&
								Object.keys(objItems).map((item, index) => (
									<Fragment key={objItems[item].invoiceCode}>

										<tr className="tb-parent" data-group="itemGroup" data-itemid={item}>
											<td className='fs-10'>{objItems[item].invoiceCode}</td>
											<td className="fs-10 rule-date">{DateHelper.displayTime(objItems[item].invoiceDate)}</td>
											<td className={"fs-10 text-center " + this.handleHighlight(objItems[item].payCustomer)}>{StringHelper.formatValue(objItems[item].payCustomer)}</td>
											<td className={"fs-10 text-center " + this.handleHighlight(objItems[item].returnPaid)}>{StringHelper.formatValue(objItems[item].returnPaid)}</td>
											<td className={"fs-10 text-center " + this.handleHighlight(objItems[item].totalAmount)}>{StringHelper.formatValue(objItems[item].totalAmount)}</td>
											<td className={"fs-10 text-center " + this.handleHighlight(objItems[item].discount)}>{StringHelper.formatValue(objItems[item].discount)}</td>
											<td className={"fs-10 text-center " + this.handleHighlight(objItems[item].billGrossSales)}>{StringHelper.formatValue(objItems[item].billGrossSales)}</td>
											<td className='fs-10'>{objItems[item].employeeCode}</td>
											<td className='fs-10'>{objItems[item].employeeName}</td>
											<td className='fs-10'>
												<span className='btn-org text-center d-inline-block btn-expand-tr-items' style={{ width: 20, height: 20, borderRadius: 2, lineHeight: "16px", margin: 5 }} onClick={(e) => this.handleExpandItems(e)}>+</span>
												{
													this.props.itemsLog && this.props.itemsLog.filter(el => el.invoiceCode == objItems[item].invoiceCode) && this.props.itemsLog.filter(el => el.invoiceCode == objItems[item].invoiceCode).length > 0 ?
														<span className="badge bg-success text-dark fs-9" style={{ padding: '3px 7px' }} onClick={() => { this.props.updateInvoiceSeleted(objItems[item].invoiceCode) }}>
															View log
														</span>
														:
														<>
															{
																this.props.isShowLog === false ? null : <span className="badge bg-warning text-dark fs-9" style={{ padding: '3px 7px' }} >
																	Updating
																</span>
															}
														</>

												}
											</td>
										</tr>

										{
											(objItems[item].details && objItems[item].details.length > 0) &&
											<tr className='d-none tb-child-items' style={{ background: 'beige' }}>
												<td colSpan={12} className="text-center" style={{ padding: '5px 15px 15px' }}>
													<table className='table table-hover cl-chocolate' style={{ width: '100%' }}>
														<thead style={{ zIndex: 1 }}>
															<tr>
																<th style={{ zIndex: 0 }} className="fs-10">Item code</th>
																<th style={{ zIndex: 0 }} className="fs-10">Item name</th>
																<th style={{ zIndex: 0 }} className="fs-10 text-center">Qty</th>
																<th style={{ zIndex: 0 }} className="fs-10 text-center">Item discount</th>
																<th style={{ zIndex: 0 }} className="fs-10 text-center">VAT</th>
																<th style={{ zIndex: 0 }} className="fs-10 text-center">VAT amount</th>
																<th style={{ zIndex: 0 }} className="fs-10 text-center">Gross sales</th>
																{
																	objItems[item].listpayment && objItems[item].listpayment.length > 0 ? objItems[item].listpayment.map((a, ia) => (
																		<Fragment key={ia + item}>
																			<th style={{ zIndex: 0 }} className="fs-10 text-center">{a.paymentMethodName}</th>
																		</Fragment>
																	)) : null
																}
															</tr>
														</thead>

														<tbody>
															<tr>
																<td style={{ height: 0, padding: 0, border: 'none' }}></td>
																<td style={{ height: 0, padding: 0, border: 'none' }}></td>
																<td style={{ height: 0, padding: 0, border: 'none' }}></td>
																<td style={{ height: 0, padding: 0, border: 'none' }}></td>
																<td style={{ height: 0, padding: 0, border: 'none' }}></td>
																<td style={{ height: 0, padding: 0, border: 'none' }}></td>
																<td style={{ height: 0, padding: 0, border: 'none' }}></td>
																{
																	objItems[item] && objItems[item].listpayment && objItems[item].listpayment.map((a, ia) => (
																		<td key={index + ia + item} rowSpan={objItems[item].details.length + 1} className={"fs-10 text-center " + this.handleHighlight(a.amount)}>{StringHelper.formatValue(a.amount)}</td>
																	))
																}
															</tr>

															{
																objItems[item].details.map((el, i) => (
																	<tr key={el.itemCode + 'lstItem' + i}>
																		<td className="fs-10 text-left">{el.itemCode}</td>
																		<td className="fs-10 text-left">{el.itemName}</td>
																		<td className={"fs-10 text-center " + this.handleHighlight(el.qty)}>{StringHelper.formatValue(el.qty)}</td>
																		<td className={"fs-10 text-center " + this.handleHighlight(el.itemDiscount)}>{StringHelper.formatValue(el.itemDiscount)}</td>
																		<td className={"fs-10 text-center " + this.handleHighlight(el.vat)}>{StringHelper.formatValue(el.vat)}</td>
																		<td className={"fs-10 text-center " + this.handleHighlight(el.vatAmount)}>{StringHelper.formatValue(el.vatAmount)}</td>
																		<td className={"fs-10 text-center " + this.handleHighlight(el.grossSales)}>{StringHelper.formatValue(el.grossSales)}</td>
																	</tr>
																))
															}
														</tbody>
													</table>
												</td>
											</tr>
										}
									</Fragment>
								))}
						</tbody>
					</table>
					{Object.keys(objItems).length === 0 ? <div className="table-message">Search ...</div> : ""}
				</div>
			</section>
		);
	}
}