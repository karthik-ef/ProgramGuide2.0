import React, { Component } from 'react';
import Up from './UpIcon.png';
import Down from './DownIcon.png';
import $ from 'jquery';
import * as API from '../../api/ContentEditor';

//Import Editor components
import PageTagSection from '../PageEditor/PageTagSection';
import ParentPage from '../PageEditor/ParentPage';
import MetaInformation from '../PageEditor/MetaInformation';
import PageContent from '../PageEditor/PageContent';
import DrillDown from '../PageEditor/DrillDown';
import BannerImage from '../PageEditor/BannerImage';
import PageStatus from '../PageEditor/PageStatus';
import './PageEditor.css';
import { connect } from 'react-redux';
import SuggestedKeywords from './SuggestedKeywords';

class PageEditor extends Component {

    constructor() {
        super();
        this.modifiedData = {};
        this.objPageTag = {};
        this.objParentPageUrl = {};
        this.objMetaInformation = {};
        this.objPageContent = {};
        this.objDrillDown = {};
        this.objBannerImage = {};
        this.objPageStatus = {};
        this.isPageTagModified = false;
        this.isParentPageModified = false;
        this.isMetaInformationModified = false;
        this.isPageContentModified = false;
        this.isDrillDownModified = false;
        this.isBannerImageModified = false;
        this.isPageStatusModified = false;
        this.objCustomizedData = {};
        this.objDrillDownAlias = {}
        this.Checkduplicate = {};
        this.validation = false;
        this.pageTaggingData = [];

        this.state = {
            showDuplicateErrorForCreate: false,
            //showDuplicateErrorForUpdate: false,
        }
    }

    componentDidMount() {

        API.getMaxOfUniqueContentId.call(this);
        $('#pageEditor').modal('show');
        $('.card').on('shown.bs.collapse', function () {
            if ($(this).attr('id') !== 'drillDownPreview') {
                $(this).find('img').attr("src", Up)
            }
        });

        $('.card').on('hidden.bs.collapse', function () {
            if ($(this).attr('id') !== 'drillDownHide') {
                $(this).find('img').attr("src", Down)
            }
        });

        // While creating new page, pageUrl will be empty.
        var pageUrl = this.props.EditPageRow !== undefined
            ? this.props.EditPageRow['EditRowData']['PageUrl']
            : ''

        //Store the page tagging for the selected market
        this.pageTaggingData = this.props.storeData._uniqueContentData
            .filter(m => m.MarketCode === this.props.storeData._selectedMarket
                && m.PageUrl !== pageUrl)
            .map(m => {
                return m.Tag_Topic + '_' +
                    m.Tag_When + '_' +
                    m.Tag_CourseType + '_' +
                    m.Tag_AgeRange + '_' +
                    m.Tag_Duration + '_' +
                    m.Tag_LanguageOfInstruction + '_' +
                    m.Tag_LanguageLearned + '_' +
                    m.Tag_Platform + '_' +
                    m.Tag_Continent + '_' +
                    m.Tag_Country + '_' +
                    m.Tag_State + '_' +
                    m.Tag_City + '_' +
                    m.Tag_Feature + '_' +
                    m.AdditionalDurationDetails
            });
    }

    updatePageAliasToQA() {
        let EditPage = this.props.EditPageRow !== undefined ? this.props.EditPageRow['EditRowData'] : [];
        if (this.objDrillDown['DrillDownAlias'] !== undefined) {
            this.objDrillDownAlias.UniqueContent_ID = EditPage['UniqueContent_ID'] ? EditPage['UniqueContent_ID'] : this.maxOfUniqueContentId + 1;
            this.objDrillDownAlias.DrilldownAliasXml = this.objDrillDown['DrillDownAlias'];
            API.saveDrilldownAliasTagsDetailsQA.call(this);
        }
    }

    updateCustomizedLinksToQA() {
        let EditPage = this.props.EditPageRow !== undefined ? this.props.EditPageRow['EditRowData'] : [];
        if (this.objDrillDown['CustomizedLinksData'] !== undefined) {
            this.objCustomizedData.UniqueContent_ID = EditPage['UniqueContent_ID'] ? EditPage['UniqueContent_ID'] : this.maxOfUniqueContentId + 1;
            this.objCustomizedData.LinkPageXml = '<CustomizedLinks>' + this.objDrillDown['CustomizedLinksData'] + '</CustomizedLinks>';
            API.saveCustomizedLinksDetailsQA.call(this);
        }
    }

    updatePageAliasToLIVE() {
        let EditPage = this.props.EditPageRow !== undefined ? this.props.EditPageRow['EditRowData'] : [];
        if (this.objDrillDown['DrillDownAlias'] !== undefined) {
            this.objDrillDownAlias.UniqueContent_ID = EditPage['UniqueContent_ID'] ? EditPage['UniqueContent_ID'] : this.maxOfUniqueContentId + 1;
            this.objDrillDownAlias.DrilldownAliasXml = this.objDrillDown['DrillDownAlias'];
            API.saveDrilldownAliasTagsDetailsLive.call(this);
        }
    }

    updateCustomizedLinksToLIVE() {
        let EditPage = this.props.EditPageRow !== undefined ? this.props.EditPageRow['EditRowData'] : [];
        if (this.objDrillDown['CustomizedLinksData'] !== undefined) {
            this.objCustomizedData.UniqueContent_ID = EditPage['UniqueContent_ID'] ? EditPage['UniqueContent_ID'] : this.maxOfUniqueContentId + 1;
            this.objCustomizedData.LinkPageXml = '<CustomizedLinks>' + this.objDrillDown['CustomizedLinksData'] + '</CustomizedLinks>';
            API.saveCustomizedLinksDetailsLive.call(this);
        }
    }

    getModifiedData() {
        let EditPage = this.props.EditPageRow !== undefined ? this.props.EditPageRow['EditRowData'] : [];
        if (this.props.isNewPage !== undefined) {
            this.modifiedData.UniqueContent_ID = this.maxOfUniqueContentId + 1;
            this.modifiedData.MarketCode = this.props.storeData._selectedMarket;
            this.modifiedData.PageURL = this.props.PageUrl;
            this.modifiedData.IsActive = this.isPageStatusModified ? this.objPageStatus : false;
            this.modifiedData.ParentPageID = this.isParentPageModified ? this.objParentPageUrl : 0;
        }
        else {
            this.modifiedData.UniqueContent_ID = EditPage['UniqueContent_ID'];
            this.modifiedData.MarketCode = EditPage['MarketCode'];
            this.modifiedData.PageURL = EditPage['PageUrl'];
            this.modifiedData.IsActive = this.isPageStatusModified ? this.objPageStatus : EditPage['IsActive'];
            this.modifiedData.ParentPageID = this.isParentPageModified ? this.objParentPageUrl : EditPage['ParentPageID'];
        }

        var arr = this.objPageTag.toString().split('_')

        this.modifiedData.TagKeywordTopic = this.isPageTagModified && arr.length === 14
            ? arr[0]
            : this.props.isNewPage !== undefined ? '00' : EditPage['Tag_Topic'];

        this.modifiedData.TagWhen = this.isPageTagModified && arr.length === 14
            ? arr[1]
            : this.props.isNewPage !== undefined ? '00' : EditPage['Tag_When'];

        this.modifiedData.TagCourseType = this.isPageTagModified && arr.length === 14
            ? arr[2]
            : this.props.isNewPage !== undefined ? '00' : EditPage['Tag_CourseType'];

        this.modifiedData.TagAgeRange = this.isPageTagModified && arr.length === 14
            ? arr[3]
            : this.props.isNewPage !== undefined ? '00' : EditPage['Tag_AgeRange'];

        this.modifiedData.TagDuration = this.isPageTagModified && arr.length === 14
            ? arr[4]
            : this.props.isNewPage !== undefined ? '00' : EditPage['Tag_Duration'];

        this.modifiedData.TagLocalOffice = this.isPageTagModified && arr.length === 14
            ? arr[5]
            : this.props.isNewPage !== undefined ? '00' : EditPage['Tag_LanguageOfInstruction'];

        this.modifiedData.TagLanguage = this.isPageTagModified && arr.length === 14
            ? arr[6]
            : this.props.isNewPage !== undefined ? '00' : EditPage['Tag_LanguageLearned'];

        this.modifiedData.TagPlatform = this.isPageTagModified && arr.length === 14
            ? arr[7]
            : this.props.isNewPage !== undefined ? '00' : EditPage['Tag_Platform'];

        this.modifiedData.TagContinent = this.isPageTagModified && arr.length === 14
            ? arr[8]
            : this.props.isNewPage !== undefined ? '00' : EditPage['Tag_Continent'];

        this.modifiedData.TagCountry = this.isPageTagModified && arr.length === 14
            ? arr[9]
            : this.props.isNewPage !== undefined ? '00' : EditPage['Tag_Country'];

        this.modifiedData.TagState = this.isPageTagModified && arr.length === 14
            ? arr[10]
            : this.props.isNewPage !== undefined ? '00' : EditPage['Tag_State'];

        this.modifiedData.TagCity = this.isPageTagModified && arr.length === 14
            ? arr[11]
            : this.props.isNewPage !== undefined ? '00' : EditPage['Tag_City'];

        this.modifiedData.TagFeature = this.isPageTagModified && arr.length === 14
            ? arr[12]
            : this.props.isNewPage !== undefined ? '00' : EditPage['Tag_Feature'];

        this.modifiedData.TagDurationAdditionalDetails = this.isPageTagModified && arr.length === 14
            ? arr[13]
            : this.props.isNewPage !== undefined ? '' : EditPage['AdditionalDurationDetails'];

        this.modifiedData.BannerImage = this.isBannerImageModified
            ? this.objBannerImage['BannerImage']
            : this.props.isNewPage !== undefined ? '' : EditPage['BannerImage'];

        this.modifiedData.MetaTitle = this.isMetaInformationModified
            ? this.objMetaInformation['MetaTitle']
            : this.props.isNewPage !== undefined ? '' : EditPage['MetaTitle'];
        this.modifiedData.MetaDescription = this.isMetaInformationModified
            ? this.objMetaInformation['MetaDescription']
            : this.props.isNewPage !== undefined ? '' : EditPage['MetaDescription'];
        this.modifiedData.MetaRobot = this.isMetaInformationModified
            ? this.objMetaInformation['MetaRobot']
            : this.props.isNewPage !== undefined ? '' : EditPage['MetaRobot'];

        this.modifiedData.PageTitle = this.isPageContentModified && this.objPageContent['PageTitle'] !== undefined
            ? this.objPageContent['PageTitle']
            : this.props.isNewPage !== undefined ? '' : EditPage['PageTitle'];

        this.modifiedData.VisibleIntroText = this.isPageContentModified && this.objPageContent['VisibleIntroText'] !== undefined
            ? this.objPageContent['VisibleIntroText']
            : this.props.isNewPage !== undefined ? '' : EditPage['VisibleIntroText'];

        this.modifiedData.HiddenIntroText = this.isPageContentModified && this.objPageContent['HiddenIntroText'] !== undefined
            ? this.objPageContent['HiddenIntroText']
            : this.props.isNewPage !== undefined ? '' : EditPage['HiddenIntroText'];

        this.modifiedData.SubHeader1 = this.isPageContentModified && this.objPageContent['SubHeader1'] !== undefined
            ? this.objPageContent['SubHeader1']
            : this.props.isNewPage !== undefined ? '' : EditPage['SubHeader1'];

        this.modifiedData.SubHeader2 = this.isPageContentModified && this.objPageContent['SubHeader2'] !== undefined
            ? this.objPageContent['SubHeader2']
            : this.props.isNewPage !== undefined ? '' : EditPage['SubHeader2'];

        this.modifiedData.ContentText1 = this.isPageContentModified && this.objPageContent['ContentText1'] !== undefined
            ? this.objPageContent['ContentText1']
            : this.props.isNewPage !== undefined ? '' : EditPage['ContentText1'];

        this.modifiedData.ContentText2 = this.isPageContentModified && this.objPageContent['ContentText2'] !== undefined
            ? this.objPageContent['ContentText2']
            : this.props.isNewPage !== undefined ? '' : EditPage['ContentText2'];

        this.modifiedData.BreadcrumbText = this.isPageContentModified && this.objPageContent['BreadcrumbText'] !== undefined
            ? this.objPageContent['BreadcrumbText']
            : this.props.isNewPage !== undefined ? '' : EditPage['BreadcrumbText'];


        this.modifiedData.FeaturePageTag1 = this.isDrillDownModified && this.objDrillDown['FeaturePageTag1'] !== undefined
            ? this.objDrillDown['FeaturePageTag1']
            : this.props.isNewPage !== undefined ? '' : EditPage['FeaturePageTag1'];

        this.modifiedData.FeaturePageTag2 = this.isDrillDownModified && this.objDrillDown['FeaturePageTag2'] !== undefined
            ? this.objDrillDown['FeaturePageTag2']
            : this.props.isNewPage !== undefined ? '' : EditPage['FeaturePageTag2'];

        this.modifiedData.UserName = this.props.storeData._loginDetails.userName;

        // var tagStructure = {};
        // if (this.isPageTagModified) {
        //     tagStructure = this.objPageTag.toString();
        // }

        // if (this.Checkduplicate.filter(m => m.Tags === tagStructure).length > 0) {
        //     this.validation = true;
        //     this.setState({ showDuplicateErrorForCreate: true });

        // }
        // else if (this.props.isNewPage !== undefined) {
        //     this.setState({ showDuplicateErrorForCreate: false })
        //     API.createNewPage.call(this);
        // }
        // else {
        //     API.updateUniqueContent.call(this);
        // }




        // if (!this.validation) {
        //     $('#pageEditor').modal('hide');
        //     this.props.getEditorContentData('Data updated');
        // }
    }

    async UpdateToLive() {
        if (!this.pageTaggingData.includes(this.objPageTag)) {
            await this.getModifiedData();
            await this.UpdateToQA();
            await this.updatePageAliasToLIVE();
            await this.updateCustomizedLinksToLIVE();
            await API.publishToLive.call(this);
        }
        else {
            alert('The selected page tagging is already present. Please change.')
        }
    }
    //Update the modified data to QA
    async UpdateToQA() {
        if (!this.pageTaggingData.includes(this.objPageTag)) {
            await this.getModifiedData();

            this.props.isNewPage !== undefined
                ? API.createNewPage.call(this)
                : API.updateUniqueContent.call(this);

            await this.updatePageAliasToQA();
            await this.updateCustomizedLinksToQA();

            if (!this.validation) {
                $('#pageEditor').modal('hide');
                this.props.getEditorContentData('Data updated');
            }
        }
        else {
            alert('The selected page tagging is already present. Please change.')
        }
    }

    // Call back methods from page section
    PageTagSection = (value) => {
        this.isPageTagModified = true;
        this.objPageTag = value;
    }

    ParentPageSection = (value) => {
        this.isParentPageModified = true;
        this.objParentPageUrl = value;
    }

    MetaInformationSection = (value) => {
        this.isMetaInformationModified = true;
        this.objMetaInformation = value;
    }

    PageContentSection = (value) => {
        this.isPageContentModified = true;
        this.objPageContent = value;
    }

    DrillDownSection = (value) => {
        this.isDrillDownModified = true;
        this.objDrillDown = value;
    }

    BannerImageSection = (value) => {
        this.isBannerImageModified = true;
        this.objBannerImage = value;
    }

    PageStatusSection = (value) => {
        this.isPageStatusModified = true;
        this.objPageStatus = value;
    }

    // Pass the value to parent component
    modalClosed() {
        this.props.getEditorContentData('closed');
    }

    Close() {
        $('#pageEditor').modal('hide');
        this.props.getEditorContentData('closed');
    }

    render() {
        const EditPage = this.props.EditPageRow !== undefined ? this.props.EditPageRow['EditRowData'] : [];
        const UniqueContentData = this.props.EditPageRow !== undefined ? this.props.EditPageRow['UniqueContentData'] : this.props.uniqueResult;
        this.Checkduplicate = UniqueContentData;
        return (
            <div>
                <div class="modal hide fade editor__modal" id="pageEditor" tabindex="-1" role="dialog" aria-labelledby="pageEditorTitle" aria-hidden="true" data-backdrop="static" data-keyboard="false">
                    <div class="modal-dialog modal-lg" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={this.modalClosed.bind(this)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div className="body-title">
                                    <strong> URL: {EditPage['PageUrl'] === undefined ? this.props.PageUrl : EditPage['PageUrl']} </strong>
                                </div>
                                <div class="accordion" id="pageEditorSection">
                                    <PageTagSection data={EditPage} SelectedValue={this.PageTagSection.bind(this)} />
                                    <ParentPage UniqueContentData={UniqueContentData} setParentPageData={EditPage['ParentPageID']} getParentPageData={this.ParentPageSection.bind(this)} />
                                    <SuggestedKeywords UniqueContent_ID={EditPage['UniqueContent_ID']} />
                                    <MetaInformation data={EditPage} MetaInformation={this.MetaInformationSection.bind(this)} />
                                    <PageContent setPageContentData={EditPage} getPageContentData={this.PageContentSection.bind(this)} />
                                    <DrillDown setDrillDownData={EditPage} getDrillDownData={this.DrillDownSection.bind(this)} UniqueContentData={UniqueContentData.filter(m => m.PageUrl !== EditPage['PageUrl'])} />
                                    <BannerImage setBannerImageData={EditPage['BannerImage']} getBannerImageData={this.BannerImageSection.bind(this)} />
                                    <PageStatus setPageStatusData={EditPage['IsActive']} getPageStatusData={this.PageStatusSection.bind(this)} />
                                </div>
                            </div>
                            <div class="modal-footer">
                                {this.state.showDuplicateErrorForCreate ? <div class="alert alert-danger" role="alert">
                                    This set of tags already exist for other Pagr URL, Please reset the tags.
                                </div> : ''}
                                {/* {this.state.showDuplicateErrorForUpdate ? <div class="alert alert-danger" role="alert">
                                Please modify the data before saving.
                                </div> : ''} */}
                                <button type="button" class="btn btn-modal-default" onClick={this.Close.bind(this)}>Cancel</button>
                                <button type="button" class="btn btn-primary btn-modal" onClick={this.UpdateToQA.bind(this)}>Save</button>
                                {this.props.isNewPage === undefined
                                    ? <button type="button" class="btn btn-primary btn-modal" onClick={this.UpdateToLive.bind(this)}>Publish</button>
                                    : ''
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect((state, props) => { return { storeData: state } })(PageEditor);
