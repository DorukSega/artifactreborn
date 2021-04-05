CArtifactDeckDecoder = (() => {
    const DeckCodePrefix = "RTFACT";
    const VersionToMatch = 2;

    const ContinuousVars = new Array();

    const ParseDeck = (FullDeckCode) => {
        const DeckBytes = GetDeckBytes(FullDeckCode);
        if (!DeckBytes) {
            return false;
        } else {
            return ParseDeckInner(FullDeckCode, DeckBytes);
        }
    };

    const GetDeckBytes = (FullDeckCode) => {
        if (FullDeckCode.substring(0, DeckCodePrefix.length) === DeckCodePrefix) {
                let DeckCodeNoPrefix = FullDeckCode.substring(
                DeckCodePrefix.length
            );
            DeckCodeNoPrefix = DeckCodeNoPrefix.replace(/_/g, "=");
            DeckCodeNoPrefix = DeckCodeNoPrefix.replace(/-/g, "/");
            const DecodedDeckCode = atob(DeckCodeNoPrefix);
            const DeckBytesArray = new Array();
            for (let i = 0; i < DecodedDeckCode.length; i++) {
                DeckBytesArray.push(DecodedDeckCode.charCodeAt(i));
            }
            return DeckBytesArray;
        } else {
            return false;
        }
    };

    const ParseDeckInner = (FullDeckCode, DeckBytes) => {
        ContinuousVars["CurrentByteIndex"] = 0;
        let TotalBytes = DeckBytes.length;
        const VersionAndHeroes = DeckBytes[ContinuousVars["CurrentByteIndex"]++];
        const VersionFromDeckCode = VersionAndHeroes >> 4;
        if (VersionToMatch != VersionFromDeckCode && VersionFromDeckCode != 1) {
            return false;
        }
        const Checksum = DeckBytes[ContinuousVars["CurrentByteIndex"]++];
        let StringLength = 0;
        if (VersionToMatch > 1) {
            StringLength = DeckBytes[ContinuousVars["CurrentByteIndex"]++];
        }
        const TotalCardBytes = TotalBytes - StringLength;
        let ComputedChecksum = 0;
        for (let cs = ContinuousVars["CurrentByteIndex"]; cs < TotalCardBytes; cs++) {
            ComputedChecksum += DeckBytes[cs];
        }
        const Masked = ComputedChecksum & 0xff;
        if (Checksum != Masked) {
            return false;
        }

        ContinuousVars["NumHeroes"] = 0;

        if (!ReadUint32(VersionAndHeroes, 3, DeckBytes, "CurrentByteIndex", TotalCardBytes, "NumHeroes")) {
            return false;
        }
        const HeroesArray = new Array();
        ContinuousVars["PrevCardBase"] = 0;

        for (let CurrentHero = 0; CurrentHero < ContinuousVars["NumHeroes"]; CurrentHero++) {
            ContinuousVars["HeroTurn"] = 0;
            ContinuousVars["HeroCardID"] = 0;
            if (!ReadSerialisedCard(DeckBytes, "CurrentByteIndex", TotalCardBytes, "PrevCardBase", "HeroTurn", "HeroCardID")) {
                return false;
            }
            HeroesArray.push({id: ContinuousVars["HeroCardID"], turn: ContinuousVars["HeroTurn"]});
        }
        const CardsArray = new Array();
        ContinuousVars["PrevCardBase"] = 0;

        while (ContinuousVars["CurrentByteIndex"] < TotalCardBytes) {
            ContinuousVars["CardCount"] = 0;
            ContinuousVars["CardID"] = 0;
            if (!ReadSerialisedCard(DeckBytes, "CurrentByteIndex", TotalCardBytes, "PrevCardBase", "CardCount", "CardID")) {
                return false;
            }
            CardsArray.push({id: ContinuousVars["CardID"],count: ContinuousVars["CardCount"]});
        }
        let DeckName = "";
        if (ContinuousVars["CurrentByteIndex"] <= TotalBytes) {
            const bytes = DeckBytes.slice(-1 * StringLength);
            for (let bc = 0; bc < bytes.length; bc++) {
                DeckName += String.fromCharCode(bytes[bc]);
            }
            const FullDeckArray = {heroes: HeroesArray, cards: CardsArray, name: DeckName};
            return FullDeckArray;
        }
    };
//                                    &                     &             &         &
    const ReadSerialisedCard = (Data, IndexStart, IndexEnd, PrevCardBase, OutCount, RSCOutCardID) => {
        if (ContinuousVars[IndexStart] > IndexEnd) {
            return false;
        }
        const Header = Data[ContinuousVars[IndexStart]];
        ContinuousVars[IndexStart]++;
        const HasExtendedCount = Header >> 6 == 0x03;

        if (!ReadUint32(Header, 5, Data, IndexStart, IndexEnd, "CardDelta")) {
            return false;
        }
        ContinuousVars[RSCOutCardID] =
            ContinuousVars[PrevCardBase] + ContinuousVars["CardDelta"];

        if (HasExtendedCount) {
            if (!ReadUint32(0, 0, Data, IndexStart, IndexEnd, OutCount)) {
                return false;
            }
        } else {
            ContinuousVars[OutCount] = (Header >> 6) + 1;
        }
        ContinuousVars[PrevCardBase] = ContinuousVars[RSCOutCardID];
        return true;
    };

//                                                 &                     &
    const ReadUint32 = (BaseValue, BaseBits, Data, IndexStart, IndexEnd, RU32OutValue) => {
        ContinuousVars[RU32OutValue] = 0;
        let DeltaShift = 0;

        if (BaseBits == 0 || ReadBitsChunk(BaseValue, BaseBits, DeltaShift, RU32OutValue)
        ) {
            DeltaShift = BaseBits;
            while (true) {
                if (ContinuousVars[IndexStart] > IndexEnd) {
                    return false;
                }
                const NextByte = Data[ContinuousVars[IndexStart]];
                ContinuousVars[IndexStart]++;

                if (!ReadBitsChunk(NextByte, 7, DeltaShift, RU32OutValue)) {
                    break;
                }
                DeltaShift += 7;
            }
        }
        return true;
    };

    const ReadBitsChunk = (Chunk, NumBits, CurrShift, OutBits) => {
        const ContinueBit = 1 << NumBits;
        const NewBits = Chunk & (ContinueBit - 1);
        ContinuousVars[OutBits] |= NewBits << CurrShift;
        return (Chunk & ContinueBit) != 0;
    };

    return { ParseDeck };
})();
