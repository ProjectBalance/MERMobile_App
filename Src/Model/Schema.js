import React from 'react';

const SettingsSchema = {
    name: 'Settings',
    primaryKey: 'key',
    properties: {
      key:  'string',
      value: 'string'
    }
}

const CountrySchema = {
  name: 'Country',
  primaryKey: 'key',
  properties: {
    key:  'string'
  }
}

const EventSchema = {
    name: 'Event',
    primaryKey: 'id',
    properties: {
      id:'string',
      name: 'string',
      country: 'string',
      startdate:  'date',
      enddate: 'date',
      description: 'string',
      location:'string',
      data:'string'
    }
};

const GroupSchema = {
  name: 'Group',
  primaryKey: 'id',
  properties: {
    id:  'string',
    country: 'string',
    name: 'string',
    type:'string',
    sort:'int',
    data:'string'
  }
}


const ReportingFrequencySchema = {
  name: 'ReportingFrequency',
  primaryKey: 'id',
  properties: {
    id:  'string',
    country: 'string',
    name: 'string',
    description:'string',
    color:'string'
  }
}

const IndicatorSchema = {
    name: 'Indicator',
    primaryKey: 'id',
    properties: {
      id:  'string',
      code: { type: 'string', indexed: true },
      country:'string',
      group: { type: 'string', indexed: true },
      displayOrder:'int',
      data: 'string'
    }
};

const ModelSchema = {
    name: 'Model',
    primaryKey: 'id',
    properties: {
      id:  'string',
      data: 'string',
    }
};

const BookmarkSchema = {
  name: 'Bookmark',
  primaryKey: 'id',
  properties: {
    id:  'string',
    name: 'string',
    onHome:'bool'
  }

  
};

const BookmarkMapSchema = {
  name: 'BookmarkMap',
  properties: {
    country:'string',
    name: 'string',
    level:'string',
    state:'string',
    selected:'string',
    parent:'string'
  }

  
};

const AboutSchema = {
  name: 'About',
  primaryKey: 'id',
  properties: {
    id:  'string',
    description: 'string',
    order:'int'
  }

};

const DefinitionSchema = {
  name: 'Definition',
  primaryKey: 'id',
  properties: {
    id:  'string',
    key: 'string',
    definition: 'string',
    country:'string'
  }

};

const ResourceSchema = {
  name: 'Resource',
  primaryKey: 'id',
  properties: {
    id:  'string',
    country: 'string',
    title: 'string',
    link: 'string',
    type: 'string',
    description: 'string',
    order: 'int'
  }

};

const MapSchema = {
  name: 'Map',
  primaryKey: 'id',
  properties: {
    id:  'string',
    country: { type: 'string', indexed: true },
    name: 'string',
    label: 'string',
    level:'int',
    geojson:'string?',
    sublevel:'string?'
  }

};

const MapDataSchema = {
  name: 'MapData',
  primaryKey: 'id',
  properties: {
    id:  'string',
    country: { type: 'string', indexed: true },
    data: 'string'
  }

};

const MapDetailSchema = {
  name: 'MapDetail',
  primaryKey: 'id',
  properties: {
    id:  'string',
    country: { type: 'string', indexed: true },
    name: 'string',
    description:'string',
    type:'string',
    color:'string',
    mapItem:'string?',
    indicator:'string?',
    data:'string'
  }

};

const PartnerMapSchema = {
  name: 'PartnerMap',
  primaryKey: 'id',
  properties: {
    id:  'string',
    country: { type: 'string', indexed: true },
    partnerID:'string',
    mapItem:'string',
    data:'string'
  }

};

export {EventSchema,ModelSchema, IndicatorSchema, SettingsSchema, GroupSchema,BookmarkSchema, AboutSchema, DefinitionSchema,ResourceSchema,MapSchema,CountrySchema,MapDetailSchema,ReportingFrequencySchema,PartnerMapSchema,BookmarkMapSchema, MapDataSchema};

export const allSchema = [EventSchema,ModelSchema, IndicatorSchema, SettingsSchema, GroupSchema,BookmarkSchema,AboutSchema, DefinitionSchema,ResourceSchema,MapSchema,CountrySchema,MapDetailSchema,ReportingFrequencySchema,PartnerMapSchema,BookmarkMapSchema, MapDataSchema];