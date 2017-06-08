'use strict';

import React, {
    Component
} from 'react';


import PDFView from 'react-native-pdf-view';

export default class PdfPager extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <PDFView ref={(pdf) => {
            this.pdfView = pdf;
        }}
                        src={this.props.filePath}
                        onLoadComplete={(pageCount) => {
                            this.pdfView.setNativeProps({
                                zoom: 1.5
                            });
                        }}
                        style={{flex: 1}}/>
    }
}
