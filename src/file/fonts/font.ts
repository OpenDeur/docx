import { BuilderElement, createStringElement, OnOffElement, XmlComponent } from "@file/xml-components";

// <xsd:complexType name="CT_Font">
//     <xsd:sequence>
//         <xsd:element name="altName" type="CT_String" minOccurs="0" maxOccurs="1"/>
//         <xsd:element name="panose1" type="CT_Panose" minOccurs="0" maxOccurs="1"/>
//         <xsd:element name="charset" type="CT_Charset" minOccurs="0" maxOccurs="1"/>
//         <xsd:element name="family" type="CT_FontFamily" minOccurs="0" maxOccurs="1"/>
//         <xsd:element name="notTrueType" type="CT_OnOff" minOccurs="0" maxOccurs="1"/>
//         <xsd:element name="pitch" type="CT_Pitch" minOccurs="0" maxOccurs="1"/>
//         <xsd:element name="sig" type="CT_FontSig" minOccurs="0" maxOccurs="1"/>
//         <xsd:element name="embedRegular" type="CT_FontRel" minOccurs="0" maxOccurs="1"/>
//         <xsd:element name="embedBold" type="CT_FontRel" minOccurs="0" maxOccurs="1"/>
//         <xsd:element name="embedItalic" type="CT_FontRel" minOccurs="0" maxOccurs="1"/>
//         <xsd:element name="embedBoldItalic" type="CT_FontRel" minOccurs="0" maxOccurs="1"/>
//     </xsd:sequence>
//     <xsd:attribute name="name" type="s:ST_String" use="required"/>
// </xsd:complexType>

// <xsd:complexType name="CT_FontRel">
//     <xsd:complexContent>
//         <xsd:extension base="CT_Rel">
//             <xsd:attribute name="fontKey" type="s:ST_Guid" />
//             <xsd:attribute name="subsetted" type="s:ST_OnOff" />
//         </xsd:extension>
//     </xsd:complexContent>
// </xsd:complexType>

// http://www.datypic.com/sc/ooxml/e-w_embedRegular-1.html
export interface IFontRelationshipOptions {
    /**
     * 	Relationship to Part
     */
    readonly id: string;
    /**
     * 	Embedded Font Obfuscation Key
     */
    readonly fontKey?: string;
    /**
     * 	Embedded Font Is Subsetted
     */
    readonly subsetted?: boolean;
}

export interface IFontOptions {
    readonly name: string;
    readonly altName?: string;
    readonly panose1?: string;
    readonly charset?: string;
    readonly family?: string;
    readonly notTrueType?: boolean;
    readonly pitch?: string;
    readonly sig?: {
        readonly usb0: string;
        readonly usb1: string;
        readonly usb2: string;
        readonly usb3: string;
        readonly csb0: string;
        readonly csb1: string;
    };
    readonly embedRegular?: IFontRelationshipOptions;
    readonly embedBold?: IFontRelationshipOptions;
    readonly embedItalic?: IFontRelationshipOptions;
    readonly embedBoldItalic?: IFontRelationshipOptions;
    readonly data: Buffer;
}

const createFontRelationship = ({ id, fontKey, subsetted }: IFontRelationshipOptions): XmlComponent =>
    new BuilderElement({
        name: "w:embedRegular",
        attributes: {
            id: { key: "r:id", value: id },
            ...(fontKey ? { fontKey: { key: "w:fontKey", value: fontKey } } : {}),
        },
        children: [...(subsetted ? [new OnOffElement("w:subsetted", subsetted)] : [])],
    });

export const createFont = ({
    name,
    altName,
    panose1,
    charset,
    family,
    notTrueType,
    pitch,
    sig,
    embedRegular,
    embedBold,
    embedItalic,
    embedBoldItalic,
}: IFontOptions): XmlComponent =>
    // http://www.datypic.com/sc/ooxml/e-w_font-1.html
    new BuilderElement({
        name: "w:font",
        attributes: {
            name: { key: "w:name", value: name },
        },
        children: [
            // http://www.datypic.com/sc/ooxml/e-w_altName-1.html
            ...(altName ? [createStringElement("w:altName", altName)] : []),
            // http://www.datypic.com/sc/ooxml/e-w_panose1-1.html
            ...(panose1 ? [createStringElement("w:panose1", panose1)] : []),
            // http://www.datypic.com/sc/ooxml/e-w_charset-1.html
            ...(charset ? [createStringElement("w:charset", charset)] : []),
            // http://www.datypic.com/sc/ooxml/e-w_family-1.html
            ...(family ? [createStringElement("w:family", family)] : []),
            // http://www.datypic.com/sc/ooxml/e-w_notTrueType-1.html
            ...(notTrueType ? [new OnOffElement("w:notTrueType", notTrueType)] : []),
            ...(pitch ? [createStringElement("w:pitch", pitch)] : []),
            // http://www.datypic.com/sc/ooxml/e-w_sig-1.html
            ...(sig
                ? [
                      new BuilderElement({
                          name: "w:sig",
                          attributes: {
                              usb0: { key: "w:usb0", value: sig.usb0 },
                              usb1: { key: "w:usb1", value: sig.usb1 },
                              usb2: { key: "w:usb2", value: sig.usb2 },
                              usb3: { key: "w:usb3", value: sig.usb3 },
                              csb0: { key: "w:csb0", value: sig.csb0 },
                              csb1: { key: "w:csb1", value: sig.csb1 },
                          },
                      }),
                  ]
                : []),
            // http://www.datypic.com/sc/ooxml/e-w_embedRegular-1.html
            ...(embedRegular ? [createFontRelationship(embedRegular)] : []),
            // http://www.datypic.com/sc/ooxml/e-w_embedBold-1.html
            ...(embedBold ? [createFontRelationship(embedBold)] : []),
            // http://www.datypic.com/sc/ooxml/e-w_embedItalic-1.html
            ...(embedItalic ? [createFontRelationship(embedItalic)] : []),
            // http://www.datypic.com/sc/ooxml/e-w_embedBoldItalic-1.html
            ...(embedBoldItalic ? [createFontRelationship(embedBoldItalic)] : []),
        ],
    });
